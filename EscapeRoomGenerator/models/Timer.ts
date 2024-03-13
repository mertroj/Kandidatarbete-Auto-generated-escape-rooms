export class Timer {
    private startTime: number = 0;
    private running: boolean = false;
    elapsedTime: number = 0;

    constructor() {
        this.startTime = Date.now();
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
}
