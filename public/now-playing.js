// Get all HTML elements in the document
const elements = {
    time: document.getElementById('time'),
    settingsBtn: document.getElementById('settings-btn'),


    backgroundImg: document.getElementById('background-img'),


    paused: document.getElementById('paused'),
    thumbnail: document.getElementById('song-img'),
    title: document.getElementById('song-title'),
    artists: document.getElementById('song-artists'),

    progress: document.getElementById('progress'),


    idleScreen: document.getElementById('idle-screen'),

    idleTime: document.getElementById('idle-time'),
    idleTimeRelation: document.getElementById('idle-time-relation'),
    idleDay: document.getElementById('day'),

    idleWeatherImg: document.getElementById('weather-img'),
    idleTemperature: document.getElementById('temperature'),
    idleTemperatureRelation: document.getElementById('temperature-relation'),
    
    idleScreenText: document.getElementById('idle-screen-text'),

    
    settingsMenu: document.getElementById('settings-menu'),
    settings: {
        'spotify_ping_interval': {
            element: document.getElementById('spotify-ping-interval'),
            type: 'number'
        },
        'server_ping_interval': {
            element: document.getElementById('server-ping-interval'),
            type: 'number'
        },
        'debug_mode': {
            element: document.getElementById('debug-mode'),
            type: 'boolean'
        }
    }
}

// Connect to the socket.io connection
const socket = io();


let spotify = new Spotify();

// Authenticate the client
socket.on('authentication', function(authenticated) {
    if (authenticated == false) {
        spotify.authenticate();
    }
});

// Handle settings
// Load stored settings
let settings = {};
function updateSettingsElement(key, value) {
    el = elements.settings[key];
    switch (el.type) {
        case 'number':
            el.element.value = value;
            break;
        case 'boolean':
            if (value) {
                el.element.src = '/assets/images/check.png';
                // el.element.style.color = 'green';
            } else {
                el.element.src = '/assets/images/close.png';
                // el.element.style.color = 'red';
            }
            break;
    }
}
function updateSetting(key, value) {
    settings[key] = value;

    socket.emit('settings', settings);
}

socket.on('settings', function(data) {
    settings = data;
    
    // Change UI elements to represent loaded settings
    for (const [key, value] of Object.entries(data)) {
        if (!elements.settings[key]) {
            continue
        }

        el = elements.settings[key]
        if (typeof(value) != el.type) {
            continue
        }

        updateSettingsElement(key, value);
    }
});

// Toggle settings menu
let settingsToggled = false;
elements.settingsBtn.addEventListener('click', function() {
    settingsToggled = !settingsToggled;

    if (settingsToggled) {
        elements.settingsMenu.style.visibility = 'visible';
        elements.settingsBtn.src = '/assets/images/close.png';
    } else {
        elements.settingsMenu.style.visibility = 'hidden';
        elements.settingsBtn.src = '/assets/images/down-arrow.png';
    }
});

elements.settings['spotify_ping_interval'].element.addEventListener('change', function() {
    const adjustedId = this.id.replaceAll('-', '_');
    updateSetting(adjustedId, parseInt(this.value));
    updateSettingsElement(adjustedId, settings.spotify_ping_interval);
});
elements.settings['server_ping_interval'].element.addEventListener('change', function() {
    const adjustedId = this.id.replaceAll('-', '_');
    updateSetting(adjustedId, parseInt(this.value));
    updateSettingsElement(adjustedId, settings.server_ping_interval);
});
elements.settings['debug_mode'].element.addEventListener('click', function() {
    const adjustedId = this.id.replaceAll('-', '_');
    updateSetting(adjustedId, !settings.debug_mode);
    updateSettingsElement(adjustedId, settings.debug_mode);
});


// Update the playback info (song title, artists, thumbnail, etc)
let firstLoad = true;
socket.on('song-details', function(data) {
    if (firstLoad) {
        firstLoad = false;
        spotify.updatePlaybackDetails(data.currentTrack, true);
    } else {
        spotify.updatePlaybackDetails(data.currentTrack);
    }
});


// Update the time (e.g. 11:57 AM)
let time = new Time();

elements.idleDay.innerHTML = time.day;
elements.idleTime.innerHTML = time.time;
elements.idleTimeRelation.innerHTML = time.meridiem;
setInterval(() => {
    elements.time.innerHTML = time.now;

    // Idle screen
    elements.idleDay.innerHTML = time.day;
    elements.idleTime.innerHTML = time.time;
    elements.idleTimeRelation.innerHTML = time.meridiem;
}, 1000);


// Update weather
let weather = new Weather();

weather.get().then(response => {
    elements.idleTemperature.innerHTML = Math.round(response.main.temp);
    elements.idleWeatherImg.setAttribute('src', weather.getIcon(response.weather[0].icon));
});
setInterval(() => {
    weather.get().then(response => {
        elements.idleTemperature.innerHTML = Math.round(response.main.temp);
        elements.idleWeatherImg.setAttribute('src', weather.getIcon(response.weather[0].icon));
    });
}, 300000); // 300000 5mins


// Animate background
let backgroundAnimation = new Animation(
    elements.backgroundImg, // element
    true, // playing
    {x: -2, y: -33}, // position
    {x: [-4, 0], y: [-49.5, -16.5]}, // bounds
    {x: 0, y: 16.5}, // increment
    {x: "%", y: "vh"}, // units
    2000
);

function formatMilliseconds(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
