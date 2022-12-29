class Time {
    #date = new Date();
    #days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


    constructor() {}

    get now() {
        this.#date = new Date();

        let options = {
            hour: "2-digit",
            minute: "2-digit"
        };
        let currentTime = this.#date.toLocaleTimeString("en-AU", options).toUpperCase();

        return currentTime;
    }

    get time() {
        return this.now.slice(0, 5);
    }

    get meridiem() {
        return this.now.slice(6);
    }

    get day() {
        return this.#days[this.#date.getDay()];
    }
}