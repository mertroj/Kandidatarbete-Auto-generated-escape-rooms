import { Timer } from "../models/Timer"; // Import your Timer class
// @ts-ignore
import express, { Request, Response } from "express";

export const TimerRouter = express.Router();
const timer = Timer.getInstance(); // Create an instance of the Timer class

// Endpoint to start the timer
TimerRouter.get("/startTimer", (req: Request, res: Response) => {
    timer.start();
    res.status(200).send("Timer started.");
});

// Endpoint to pause the timer
TimerRouter.get("/pauseTimer", (req: Request, res: Response) => {
    timer.pause();
    res.status(200).send("Timer paused.");
});

// Endpoint to reset the timer
TimerRouter.get("/resetTimer", (req: Request, res: Response) => {
    timer.reset();
    res.status(200).send("Timer reset.");
});

// Endpoint to get elapsed time
TimerRouter.get("/elapsedTime", (req: Request, res: Response) => {
    const elapsedTime = timer.getElapsedTime();
    res.send({elapsedTime});
});
