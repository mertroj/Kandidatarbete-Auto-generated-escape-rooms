import express, { Request, Response } from "express";
import path from "path";

export const ImageRouter = express.Router();
const imagesData = require('../themedImages.json')

enum Theme {
    MAGICALWORKSHOP = "Magical Workshop",
    PHAROAHTOMB = "Pharoah's Tomb"
}
interface ImageRequest extends Request {
    query: {
        theme: Theme //requires us to redeclare the Theme enum in the frontend
    }
}

ImageRouter.get("/themeImage", async (req: ImageRequest, res: Response) => {
    try{
        if(req.query.theme === undefined) {
            res.status(400).send("Theme query parameter is missing");
            return;
        }
        else {
            let images: string[];
            let randomImage: string;
            switch(req.query.theme) {
                case Theme.MAGICALWORKSHOP:
                    images = imagesData[Theme.MAGICALWORKSHOP];
                    randomImage = images[Math.floor(Math.random() * images.length)];
                    console.log(randomImage);
                    res.status(200).sendFile(path.join(__dirname, '../Images/' + randomImage));
                    break;
                case Theme.PHAROAHTOMB:
                    images = imagesData[Theme.PHAROAHTOMB];
                    randomImage = images[Math.floor(Math.random() * images.length)];
                    console.log(randomImage);
                    res.status(200).sendFile(path.join(__dirname, '../Images/' + randomImage));
                    break;
                default:
                    res.status(404).send("Invalid theme query parameter");
                    return;
            }
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});
ImageRouter.get("/logoImage", async (req: Request, res: Response) => {
    try{
        res.status(200).sendFile(path.join(__dirname, '../Images/logo.jpg'));
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});
/*
function getRandomImage(): string {
    const images = imagesData[Theme.MAGICALWORKSHOP];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    console.log(path.join(__dirname, '../Images/'+randomImage));
    return randomImage;
}

console.log(getRandomImage());
*/