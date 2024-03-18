import * as path from "node:path";
import { Request, Response } from 'express';

export const JigsawRouter = require('express').Router();

JigsawRouter.get('/image', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../Images/MagicalWorkshop.png'));
});