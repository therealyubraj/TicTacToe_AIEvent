class Timer {

    constructor(duration) {
        this.duration = duration;
        this.reset();
    }

    start() {
        this.started = millis();
        this.interval = setInterval(() => {
            this.time++;
            if (this.time >= this.duration) {
                this.stop();
            }
        }, 1000);
    }

    stop() {
        this.done = true;
        clearInterval(this.interval);
    }

    reset() {
        this.time = 0;
        this.started = -999;
        this.done = false;
        clearInterval(this.interval);
        this.interval = undefined;
    }
}