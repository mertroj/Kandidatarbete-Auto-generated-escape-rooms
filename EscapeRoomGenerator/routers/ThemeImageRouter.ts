import express, { Request, Response } from "express";

export const ThemeImageRouter = express.Router();
enum Theme {
    MAGICALWORKSHOP = "Magical Workshop",
    PHAROAHTOMB = "Pharoah's Tomb"
}
interface ImageRequest extends Request {
    query: {
        theme: Theme //requires us to redeclare the Theme enum in the frontend
    }
}

ThemeImageRouter.get("/image", async (req: ImageRequest, res: Response) => {
    if(req.query.theme === undefined) {
        res.status(400).send("Theme query parameter is missing");
    }
    else {
        const anagramsData = require('../themedImages.json')
        switch(req.query.theme) {
            case Theme.MAGICALWORKSHOP:
                res.status(200).sendFile();
                break;
            case Theme.PHAROAHTOMB:
                res.status(200).sendFile("public/images/pharoahtomb.jpg", { root: "." });
                break;
            default:
                res.status(404).send("Invalid theme query parameter");
                return;
        }
    }
});