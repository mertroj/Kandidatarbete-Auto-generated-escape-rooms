import { Timer } from "../models/Timer"; // Import your Timer class
import express, { Request, Response } from "express";

export const TimerRouter = express.Router();
const timer = Timer.getInstance(); // Create an instance of the Timer class

// Endpoint to start the timer
TimerRouter.post("/startTimer", (req: Request, res: Response) => {
    try {
        timer.start();
        res.status(200).send("Timer started.");
    } catch (error: any) {
        res.status(500).send(`Error starting timer: ${error.message}`);
    }
});

// Endpoint to pause the timer
TimerRouter.put("/pauseTimer", (req: Request, res: Response) => {
    try {
        timer.pause();
        res.status(200).send("Timer paused.");
    } catch (error: any) {
        res.status(500).send(`Error pausing timer: ${error.message}`);
    }
});

// Endpoint to reset the timer
TimerRouter.put("/resetTimer", (req: Request, res: Response) => {
    try {
        timer.reset();
        res.status(200).send("Timer reset.");
    } catch (error: any) {
        res.status(500).send(`Error resetting timer: ${error.message}`);
    }
});

// Endpoint to get elapsed time
TimerRouter.get("/elapsedTime", (req: Request, res: Response) => {
    try {
        const elapsedTime = timer.getElapsedTime();
        res.status(200).send({elapsedTime});
    } catch (error: any) {
        res.status(500).send(`Error getting elapsed time: ${error.message}`);
    }
});