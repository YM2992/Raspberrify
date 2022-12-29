const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectURI
});


const Spotify = {
    

    // Auth
    getAuthoriseUrl() {
        return spotifyApi.createAuthorizeURL(scopes, state);
    },

    authoriseCodeGrant(code) {
        spotifyApi.authorizationCodeGrant(code).then(function(data) {
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
    },

    // Get currently playing track

}

module.exports = Spotify;