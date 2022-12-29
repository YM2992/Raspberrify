class Weather {
    IconsDirectory = "../assets/images/weather_icons/";

    _LATITUDE = "YOUR LATITUDE";
    _LONGITUDE = "YOUR LONGITUDE";
    _APPID = "YOUR OPENWEATHERMAP API KEY";

    constructor() {}

    async FetchWeather() {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this._LATITUDE}&lon=${this._LONGITUDE}&units=metric&appid=${this._APPID}`);

        if (response.status == 502) {
            // Status 502 is a connection timeout error
            await FetchWeather();
        } else if (response.status != 200) {
            // An error - let's show it
            console.log('Error!', response.statusText);
            // Reconnect in one second
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1000ms
            await FetchWeather();
        } else {
            // Get and show the message
            let data = await response.json();

            return data;
        }
    }

    async get() {
        return await this.FetchWeather();
    }

    getIcon(iconId = "03d") {      
        return `${this.IconsDirectory}${iconId}.png`;
    }
}