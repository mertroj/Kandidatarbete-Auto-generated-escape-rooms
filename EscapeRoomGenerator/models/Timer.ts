export class Timer {
    private startTime: number = 0;
    private running: boolean = false;
    private elapsedTime: number = 0;
    private recordedTime: number = 0;

    // singelton
    private static instance: Timer;
    public static getInstance(): Timer {
        if (!Timer.instance) {
            Timer.instance = new Timer();
        }
        return Timer.instance;
    }

    start() {
        if (!this.running) {
            this.startTime = Date.now() - this.elapsedTime;
            this.running = true;
            setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
            }, 1000); // Update every second
        }
    }
    pause() {
        this.running = false;
    }

    reset() {
        this.elapsedTime = 0;
        this.pause();
        this.running = false;
    }


    getElapsedTime() {
        return this.elapsedTime;
    }
}

// // Example usage:
// const timer = new Timer();
// timer.start();
//
// // After 5 seconds, pause the timer
// setTimeout(() => {
//     timer.pause();
// }, 5000);
//
// // After 2 more seconds, reset the timer
// setTimeout(() => {
//     timer.reset();
// }, 7000);
