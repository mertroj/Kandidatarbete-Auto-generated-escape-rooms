import { randomFloat, randomFloatRange } from "./Helpers";
import { Theme } from "./Theme";
import { OpenAI } from 'openai';
require('dotenv').config();
const apiKey = process.env.MY_API_KEY;
console.log('key:', apiKey);
const openai = new OpenAI({apiKey: apiKey});
const wordToTokenMultiplier = 1.25;

export async function generateIntroText(theme: Theme): Promise<string> {
    try {
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
            max_tokens: Math.ceil((desiredLength + 5) * wordToTokenMultiplier),
            temperature: randomTemp,
            top_p: randomTopP,
            frequency_penalty: randomFrequencyPenalty,
        });
        if (!response || !response.choices[0].message.content || response.choices[0].message.content === ""){
            throw new Error("Empty response from GPT-3");
        }
        return response.choices[0].message.content;
    } catch (error: any) {
        console.error(error.message);
        return "Welcome to the " + theme + " escape room! You have 60 minutes to escape the room. Don't forget to ask for help when you need it. Good luck!";
    }
}

export async function generateEndingText(theme: Theme): Promise<string> {
    try {
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
            max_tokens: Math.ceil((desiredLength + 5) * wordToTokenMultiplier),
            temperature: randomTemp,
            top_p: randomTopP,
            frequency_penalty: randomFrequencyPenalty,
        });
        if (!response || !response.choices[0].message.content || response.choices[0].message.content === "") {
            throw new Error("Empty response from GPT-3");
        }
        return response.choices[0].message.content;
    } catch (error: any) {
        console.error(error.message);
        return "Congratulations! You have successfully escaped the " + theme + " themed escape room. We hope you enjoyed the experience and look forward to seeing you again soon!";
    }
}

export async function generateThemedPuzzleText(textToChange: string, theme: Theme): Promise<string> {
    try {
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
    } catch (error: any) {
        console.error(error.message);
        return textToChange;
    }
}