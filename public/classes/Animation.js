class Animation {
    #animationLoop;
    #element;
    #playing = false;

    #bounds = {
        x: [0, 0],
        y: [0, 0]
    };
    #position = {
        x: 0,
        y: 0
    };
    #increment = {
        x: 0,
        y: 0
    };
    #units = {
        x: "px",
        y: "px"
    };

    #interval = 2000;


    constructor(element, playing = false, position = {x: 0, y: 0}, bounds = {x: [0, 0], y: [0, 0]}, increment = {x: 0, y: 0}, units = {x: "px", y: "px"}, interval = 2000) {
        this.#element = element;
        this.#playing = playing;

        this.#position = position;
        this.#bounds = bounds;
        this.#increment = increment;
        this.#units = units;
        this.#interval = interval;

        if (this.#playing) {
            this.play();
        }
    }

    isInBounds(valueToCheck, bounds) {
        if (valueToCheck < bounds[0] || valueToCheck > bounds[1]) {
            return false;
        }
        return true;
    }

    play() {
        this.stop();

        this.#animationLoop = setInterval(() => {
            let newX, newY;
            newX = Math.ceil(Math.random() * this.#increment.x) * (Math.round(Math.random()) ? 1 : -1);
            newY = Math.ceil(Math.random() * this.#increment.y) * (Math.round(Math.random()) ? 1 : -1);
            
            if (this.isInBounds(this.#position.x + newX, this.#bounds.x)) {
                this.#position.x += newX;
                this.#element.style.left = this.#position.x + this.#units.x;
            }
        
            if (this.isInBounds(this.#position.y + newY, this.#bounds.y)) {
                this.#position.y += newY;
                this.#element.style.top = this.#position.y + this.#units.y;
            }
        }, this.#interval);

        this.#playing = true;
    }

    stop() {
        clearInterval(this.#animationLoop);

        this.#playing = false;
    }

    get isPlaying() {
        return this.#playing;
    }

    get position() {
        return this.#position;
    }
}