class Spotify {
    #lastProgress;
    #idle = false;

    dataTemplate = {
        currentTrack: {
            thumbnail: '',
            title: '',
            artists: '',

            playing: false,
            progress: 0,
            duration: 0,

            idle: false
        }
    };


    constructor () {}

    authenticate() {      
        window.location.href = "../login";
    }

    updatePlaybackDetails(data = this.dataTemplate, bypassTransitions = false) {
        // Update the song cover images and title/artists
        elements.backgroundImg.setAttribute('src', data.thumbnail);
        elements.thumbnail.setAttribute('src', data.thumbnail);
        elements.title.innerHTML = data.title;
        elements.artists.innerHTML = data.artists;

        // Remove the thumbnail image border when no song is playing
        if (data.thumbnail == '') {
            elements.thumbnail.style.border = '0';
        } else {
            elements.thumbnail.style.border = 'solid black 6px';
        }

        // Update the progress of the progress bar
        let currentProgress = formatMilliseconds(data.progress);
        
        if (currentProgress != this.#lastProgress) {
            this.#lastProgress = currentProgress;
            //elements.progressLbl.innerHTML = currentProgress;
        
            let progressValue = data.progress / data.duration * 100;
            elements.progress.style.width = `${progressValue}%`;
            //elements.progressSlider.value = progressValue;
            //document.documentElement.style.setProperty("--progress-progress", `${progressValue}%`);
        }

        // Display the "paused" overlay if no song is playing
        if (data.playing) {
            elements.paused.style.visibility = 'hidden';
        } else {
            elements.paused.style.visibility = 'visible';
        }

        // Toggle idle screen if idle
        this.#idle = data.idle;
        if (data.idle) {
            elements.idleScreen.style.visibility = 'visible';

            // Hide topbar time if idle
            elements.time.style.visibility = 'hidden';
        } else {
            elements.idleScreen.style.visibility = 'hidden';

            elements.time.style.visibility = 'visible';
        }


        return {currentTrack: data};
    }
}