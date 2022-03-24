class Timer {

    constructor(duration) {
        this.duration = duration;
        this.reset();
    }

    start() {
        console.log("Timer started");
        this.started = millis();
        this.interval = setInterval(() => {
            this.time++;
            if (this.time >= this.duration) {
                this.stop();
            }
        }, 1000);
    }

    stop() {
        console.log("Timer stopped");
        this.done = true;
        clearInterval(this.interval);
    }

    reset() {
        this.time = 0;
        this.started = -999;
        this.done = false;
        this.interval = undefined;
    }
}