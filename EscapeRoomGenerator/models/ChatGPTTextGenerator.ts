import { randomFloat, randomFloatRange } from "./Helpers";
import { Theme } from "./Theme";
import { OpenAI } from 'openai';
require('dotenv').config();
const apiKey = process.env.MY_API_KEY;
console.log('key:', apiKey);
const openai = new OpenAI({apiKey: apiKey});
const wordToTokenMultiplier = 1.25;

export async function generateIntroText(theme: Theme): Promise<string> {
    const desiredLength = 300;
    const randomTemp = randomFloat(0.4);
    const randomTopP = randomFloat(1);
    const randomFrequencyPenalty = randomFloatRange(-0.6, 0.4);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: "You are an assistant for a (" + theme + ")-themed escape room. Provide " +
                "an introduction to the room that sets the scene and explains the objective."
        }, {
            role: "user",
            content: "Generate a "+ desiredLength +" word, introduction welcoming text into a (" + theme + ")-themed escape " +
                "room game in two paragraphs only. The introduction should set the scene for players entering the escape room, " +
                "using words relevant to the theme, describing the atmosphere and the various puzzles " +
                "awaiting them. Additionally, include a tip informing players that some rooms may need " +
                "to be revisited once more puzzles are unlocked in those areas. The text should conclude " +
                "with a 'Good Luck!' message. Finally, remind players about the availability of help/hint " +
                "buttons, but caution that excessive usage may impact their final score. Make sure that the text " +
                "is split into exactly two paragraphs and is approximately "+ desiredLength +" words long for both of the paragraphs combined."
        }],
        max_tokens: (desiredLength + 5) * wordToTokenMultiplier,
        temperature: randomTemp,
        top_p: randomTopP,
        frequency_penalty: randomFrequencyPenalty,
    });
    if (!response || !response.choices[0].message.content || response.choices[0].message.content === ""){
        throw new Error("Empty response from GPT-3");
    }
    return response.choices[0].message.content;
    
    //return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet nisi fringilla, porttitor tellus quis, aliquet tortor. Quisque at tincidunt enim. Aliquam mattis sapien at ligula luctus, vitae bibendum diam ullamcorper. Pellentesque vel quam luctus, sollicitudin magna ut, vestibulum libero. Integer congue lorem ut consequat cursus. Fusce posuere pellentesque urna, eu finibus est euismod in. Nunc tristique dignissim elit eu sollicitudin. Curabitur mattis velit at commodo pharetra. Curabitur scelerisque tristique purus a finibus. Donec porta accumsan dictum. Suspendisse quam magna, scelerisque in nulla sed, ultricies suscipit nisl. Nunc vehicula tortor et dui porttitor, non convallis metus commodo. Donec vel est turpis. Mauris feugiat blandit ligula a condimentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae" +
    //"\n" + "Pellentesque lacinia dolor at diam cursus, id posuere quam sollicitudin. Cras at ornare arcu. Sed tincidunt ipsum nisl, eget vulputate ligula dignissim quis. Sed in nulla aliquet, faucibus enim eget, malesuada urna. Proin suscipit ipsum vitae tellus rhoncus hendrerit. Duis mattis velit id aliquam maximus. Nam dignissim laoreet diam, vel accumsan justo hendrerit vel. Maecenas mi risus, laoreet ut urna vel, imperdiet condimentum enim. Vivamus finibus rhoncus est nec fringilla. Fusce suscipit est ex. Donec id nulla mollis est finibus ultricies. ";
}
export async function generateEndingText(theme: Theme): Promise<string> {
    const desiredLength = 100;
    const randomTemp = randomFloat(0.4);
    const randomTopP = randomFloat(1);
    const randomFrequencyPenalty = randomFloatRange(-0.6, 0.4);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: "You are an assistant for a (" + theme + ")-themed escape room. Provide a final " + 
                "message to the room that congratulates the user for escaping the room as they are leaving."
        }, {
            role: "user",
            content: "Generate a "+ desiredLength +" word, one paragraph ending text into a (" + theme + ")-themed escape room game. " +
                "The ending should set the scene for players leaving the escape room in a themed manner, " +
                "mentioning the atmosphere of seeing away out, again related to the theme. Make sure that the text " +
                "is exactly one paragraph and is approximately "+ desiredLength +" words long for the entire single paragraph."
        }],
        max_tokens: (desiredLength + 5) * wordToTokenMultiplier,
        temperature: randomTemp,
        top_p: randomTopP,
        frequency_penalty: randomFrequencyPenalty,
    });
    if (!response || !response.choices[0].message.content || response.choices[0].message.content === "") {
        throw new Error("Empty response from GPT-3");
    }
    
    return response.choices[0].message.content;
}

export async function generateThemedPuzzleText(textToChange: string, theme: Theme): Promise<string> {
    
    const desiredLength: string = (textToChange.split(' ').length).toString(); //Buffer of 5 words
    const randomTemp: number = randomFloat(0.4);
    const randomTopP: number = randomFloat(1);
    const randomFrequencyPenalty : number= randomFloatRange(-0.6, 0.4);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: "You are a puzzle designer for a (" + theme + ")-themed escape room."
        }, {
            role: "user",
            content: "Generate a "+ desiredLength +" word puzzle or hint text into a (" + theme + ")-themed escape " +
                "room game that is equivalent in meaning to "+ textToChange +". Keep it simple for the " + 
                "reader to understand the message, but make sure it fits the theme of the room as well."
        }],
        max_tokens: Math.ceil((Number(desiredLength) + 5) * wordToTokenMultiplier), //(textToChange words count + 5) * 1.25
        temperature: randomTemp,
        top_p: randomTopP,
        frequency_penalty: randomFrequencyPenalty,
    });
    if (!response || !response.choices[0].message.content || response.choices[0].message.content === "") {
        throw new Error("Empty response from GPT-3");
    }
    
    return response.choices[0].message.content;
}

(async () => {
    const text = await generateThemedPuzzleText('Hmm, all the numbers in this equation have been replaced with letters. What is the result of the equation in numbers?', Theme.PHAROAHTOMB);
    console.log('generatePuzzleText:', text);
})();