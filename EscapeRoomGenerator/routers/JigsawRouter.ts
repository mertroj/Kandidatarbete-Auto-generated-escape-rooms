import * as path from "node:path";

export const JigsawRouter = require('express').Router();


JigsawRouter.get('image', (req, res) => {
    res.sendFile(path.join(__dirname, '../Images/MagicalWorkshop.jpg'));
});