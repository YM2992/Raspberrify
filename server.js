
// Import file system
const fs = require('fs');

// Import server/socket packages
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000;
const { Server } = require('socket.io')
const io = new Server(server);

const axios = require('axios');


// Variables
let authenticated = false;
let spotifyData = {
    currentTrack: {
        thumbnail: '',
        title: '',
        artists: '',

        playing: false,
        progress: 0,
        duration: 0,

        idle: false
    }
}

// Secrets
require('dotenv').config();
// Spotify credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = `http://localhost:${port}/callback`;
const scopes = ['user-read-playback-state', 'user-read-currently-playing'];

// Generate random state
function randomString(length = 10) {
    let result = "";
    const validCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        result += validCharacters.charAt(Math.floor(Math.random() * validCharacters.length));
    }

    return result;
}
const state = randomString(16);

// Config file
const Configurations = require('./modules/Configurations.js');
Configurations.init();


// Start server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.redirect("/main.html");
});

// Server ping interval
let server_ping_interval_id;
function server_ping_interval(interval = Configurations.data.SETTINGS.server_ping_interval) {
    if (server_ping_interval_id != null) {
        clearInterval(server_ping_interval_id);
    }

    // Send the client authentication status and song-details when this function is called
    io.emit('authentication', authenticated);
    io.emit('song-details', spotifyData);
    // Send the client authentication status and song-details on an interval
    server_ping_interval_id = setInterval(() => {
        io.emit('authentication', authenticated);
        io.emit('song-details', spotifyData);
    }, interval);
}


// Socket connection
let socketConnections = 0;
io.on('connection', (socket) => {
    socketConnections++;
    socket.on('disconnect', (reason) => {
        socketConnections--;

        if (socketConnections == 0) {
            clearInterval(server_ping_interval_id);
            clearInterval(spotify_ping_interval_id);
        }
    });

    console.log("client connected");
    // Send client authentication status and song-details
    server_ping_interval();
    spotify_ping_interval();

    // Send client stored settings
    socket.emit('settings', Configurations.data.SETTINGS);
    // Listen to client changes of settings
    socket.on('settings', function(data) {
        if (data.server_ping_interval != Configurations.data.SETTINGS.server_ping_interval) {
            server_ping_interval(data.server_ping_interval);
        }
        if (data.spotify_ping_interval != Configurations.data.SETTINGS.spotify_ping_interval) {
            spotify_ping_interval(data.spotify_ping_interval);
        }
        Configurations.set({
            SETTINGS: data
        });
    });
});

// Spotify authentication
const SpotifyWebApi = require('spotify-web-api-node');

// Set spotify credentials
const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectURI
});

// Get tokens from previous sessions
// Check if tokens are expired
if (Date.now() < Configurations.data.TOKEN_EXPIRY) {
    console.log("STORED TOKENS NOT EXPIRED")
    if (Configurations.data.ACCESS_TOKEN != null && Configurations.data.REFRESH_TOKEN != null) {
        spotifyApi.setAccessToken(Configurations.data.ACCESS_TOKEN);
        spotifyApi.setRefreshToken(Configurations.data.REFRESH_TOKEN);
        authenticated = true;
    } else {
        authenticated = false;
    }
} else {
    console.log("STORED TOKENS EXPIRED");
};

// Handle client login
app.get('/login', (req, res) => {
    // Create the authorisation URL
    let authoriseURL = spotifyApi.createAuthorizeURL(scopes, state);

    res.redirect(authoriseURL);
});

// Handle client callback
app.get('/callback', (req, res) => {
    //console.log(req.query);
    spotifyApi.authorizationCodeGrant(req.query.code).then(function(data) {
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);

            // Store tokens
            Configurations.set({
                TOKEN_EXPIRY: Date.now() + (data.body['expires_in'] * 1000),
                ACCESS_TOKEN: data.body['access_token'],
                REFRESH_TOKEN: data.body['refresh_token']
            });
    }, function(error) {
        console.log("authorizationCodeGrant Error!", error)
    }).then(function() {
        authenticated = true;
        res.redirect('/main.html');
    });
});


// Get the currently playing Spotify track
const maxTimeIdle = 0; // Time until the idle delay kicks in (ms)
const delayWhileIdle = 5000; // API call interval while no song playing (ms)
let idleDelayActive = false;
let idleTime = 0; // Time while idle/no song playing (ms)

let spotify_ping_interval_id;
function spotify_ping_interval(interval = Configurations.data.SETTINGS.spotify_ping_interval) {
    if (spotify_ping_interval_id != null) {
        clearInterval(spotify_ping_interval_id);
    }

    spotify_ping_interval_id = setInterval(() => {
        if (authenticated) {
            let currentTime = Date.now();
            
            if (spotifyData.currentTrack.thumbnail == "") {
                if (idleTime == 0) {
                    idleTime = currentTime;
                } else if (idleDelayActive && (currentTime - idleTime < delayWhileIdle)) {
                    //console.log("Time under delayWhileIdle");
                    return;
                } else if (currentTime - idleTime > maxTimeIdle) {
                    idleDelayActive = true;
                    idleTime = 0;
                    //console.log("Time exceeded maxTimeSinceLastSong");
                    return;
                }
            }
        }
    
        //console.log(Date.now(), Date.now() - timeSinceLastSong, timeSinceLastSong);
    
        spotifyApi.getMyCurrentPlayingTrack().then(async function(data) {
                // console.log("PINGED SPOTIFY API getMyCurrentPlayingTrack()")
    
                // No song playing
                if (data.body.item == null) {
                    spotifyData.currentTrack = {
                        thumbnail: '',
                        title: 'Currently not playing',
                        artists: 'nil',
    
                        playing: false,
                        progress: 1,
                        duration: 999999999,
    
                        idle: idleDelayActive
                    }
    
                    return;
                }
                idleTime = 0;
                idleDelayActive = false;
                
                
                let thumbnailImg;
                // The requested thumbnail is different from the last request, let's convert it
                if (spotifyData.currentTrack.thumbnailUrl != data.body.item.album.images[1].url) {
                    // Convert track thumbnail to base64
                    const thumbnailImageToBase64 = async function() {
                        const image = await axios.get(data.body.item.album.images[1].url, {
                            responseType: 'arraybuffer'
                        });
                        const imageBase64 = Buffer.from(image.data).toString('base64');
                        
                        return imageBase64;
                    }
                    
                    thumbnailImg = await thumbnailImageToBase64();
                    thumbnailImg = `data:image/jfif;base64,${thumbnailImg}`;
                } else {
                    // The thumbnail is the same as when previously requested, we don't need to convert it again
                    thumbnailImg = spotifyData.currentTrack.thumbnail;
                }

                // Update current track data
                spotifyData.currentTrack = {
                    thumbnailUrl: data.body.item.album.images[1].url,
                    thumbnail: thumbnailImg,
                    title: data.body.item.name || 'INVALID SONG NAME',
    
                    playing: data.body.is_playing || false,
                    progress: data.body.progress_ms || 0,
                    duration: data.body.item.duration_ms || 0,
    
                    idle: idleDelayActive
                }
    
                let artistData = '';
                data.body.item.artists.forEach(function(item, index) {
                    artistData += item.name;
    
                    if (index < data.body.item.artists.length - 1) {
                        artistData += ', ';
                    }
                });
                spotifyData.currentTrack.artists = artistData;
    
            }, function(error) {
                console.log("getMyCurrentlyPlayingTrack Error!", error);
                if (error.statusCode == 401) {
                    authenticated = false;
                }
            });
    }, interval);
}