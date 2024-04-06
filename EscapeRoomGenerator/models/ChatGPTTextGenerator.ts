import { randomFloat, randomFloatRange } from "./Helpers";
import { Theme } from "./Theme";
require('dotenv').config();
const apiKey = process.env.MY_API_KEY;
console.log('key:', apiKey);
//const openai = new OpenAI({});

export async function generateIntroText(theme: Theme): Promise<string> {
    /*
    const randomTemp = randomeFloat(0.4);
    const randomTopP = randomeFloatRange(0.6, 1.4);
    const randomFrequencyPenalty = randomeFloatRange(-0.6, 0.4);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: "You are an assistant for a (" + theme + ")-themed escape room. Provide 
                an introduction to the room that sets the scene and explains the objective."
        }, {
            role: "user",
            content: "Generate a 300 word introduction welcoming text into a (" + theme + ")-themed escape 
                room game. The introduction should set the scene for players entering the escape room, 
                using words relevant to the theme, describing the atmosphere and the various puzzles 
                awaiting them. Additionally, include a tip informing players that some rooms may need 
                to be revisited once more puzzles are unlocked in those areas. The text should conclude 
                with a 'Good Luck!' message. Finally, remind players about the availability of help/hint 
                buttons, but caution that excessive usage may impact their final score."
        }],
        max_tokens: 1000, //approx. 300 words + buffer
        temperature: randomTemp,
        top_p: randomTopP,
        frequency_penalty: randomFrequencyPenalty,
    });
    if (!response){
        throw new Error("Empty response from GPT-3");
    }
    return response.choices[0].message.content;
    */
    return "This is an intro text test response";
}
export async function generateEndingText(theme: Theme): Promise<string> {
    /*
    const randomTemp = randomFloat(0.4);
    const randomTopP = randomFloatRange(0.6, 1.4);
    const randomFrequencyPenalty = randomFloatRange(-0.6, 0.4);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: "You are an assistant for a (" + theme + ")-themed escape room. Provide a final " + 
                "message to the room that congratulates the user for escaping the room as they are leaving."
        }, {
            role: "user",
            content: "Generate a 100 word ending text into a (" + theme + ")-themed escape room game. " +
                "The ending should set the scene for players leaving the escape room in a themed manner, " +
                "mentioning the atmosphere of seeing away out, again related to the theme."
        }],
        max_tokens: 350, //approx. 100 words + buffer
        temperature: randomTemp,
        top_p: randomTopP,
        frequency_penalty: randomFrequencyPenalty,
    });
    if (!response){
        throw new Error("Empty response from GPT-3");
    }
    */
    return "This is an ending text test response";
}

export async function generateThemedPuzzleText(textToChange: string, theme: Theme): Promise<string> {
    /*
    const length: string = (textToChange.length + 5).toString(); //Buffer of 5 words
    const randomTemp: number = randomFloat(0.4);
    const randomTopP: number = randomFloatRange(0.6, 1.4);
    const randomFrequencyPenalty : number= randomFloatRange(-0.6, 0.4);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: "You are a puzzle designer for a (" + theme + ")-themed escape room."
        }, {
            role: "user",
            content: "Generate a "+ length +" word puzzle or hint text into a (" + theme + ")-themed escape " +
                "room game that is equivalent in meaning to "+ textToChange +". Keep it simple for the " + 
                "reader to understand the message, but make sure it fits the theme of the room as well."
        }],
        max_tokens: Number(length) * 3, //(textToChange.length + 5) * 3
        temperature: randomTemp,
        top_p: randomTopP,
        frequency_penalty: randomFrequencyPenalty,
    });
    if (!response){
        throw new Error("Empty response from GPT-3");
    }
    */
    return "This is a puzzle/hint text test response";
}

