export class Anagram {
    private anagramQuestion: string = '';
    private anagramAnswers: string[] = [];
    private readonly estimatedTime: number;

    constructor(estimatedTime: number) {
        this.estimatedTime = estimatedTime;
        let difficulty: string;
        if (estimatedTime >= 1 && estimatedTime <= 3) {
            difficulty = "easy";
        } else if (estimatedTime >= 4 && estimatedTime <= 7) {
            difficulty = "medium";
        } else {
            difficulty = "hard";
        }
        this.generateRandomAnagram(difficulty);
    }
    private async loadJSON(): Promise<any> { // TODO: remove any with a proper type
        return require('./anagrams.json');
    }


    private async generateRandomAnagram(difficulty: string): Promise<void> {
        const difficultyRanges: { [key: string]: [number, number] } = {
            "easy": [3, 4],
            "medium": [5, 6],
            "hard": [7, 8]
        };
        const [minLength, maxLength] = difficultyRanges[difficulty];

        const anagramsData = await this.loadJSON();

        const randomLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

        const anagrams = anagramsData[randomLength.toString()];

        if (anagrams) {
            const randomIndex = Math.floor(Math.random() * anagrams.length);
            const randomAnagram = anagrams[randomIndex];

            this.anagramQuestion = `Random Anagram of length ${randomLength}: ${randomAnagram[0]}`;
            this.anagramAnswers = randomAnagram.slice(1);
        } else {
            throw new Error(`No anagrams found for length ${randomLength}.`);
        }
    }

    getEstimatedTime(): number {
        return this.estimatedTime;
    }
    getQuestion(): string {
        return this.anagramQuestion;
    }

    getHint(): string {
        if (this.anagramAnswers.length > 0) {
            const firstLetter = this.anagramAnswers[0][0];
            return `I know the first letter is ${firstLetter.toUpperCase()}, but what's the rest?`;
        } else {
            return '';
        }
    }

    checkAnswer(userInput: string): boolean {
        const userInputLowercase = userInput.toLowerCase();

        // Check if there's a semicolon in the correct answer
        if (this.anagramAnswers[0].includes(';')) {
            const subAnswers = this.anagramAnswers[0].split(';').map(subAnswer => subAnswer.trim());
            for (const subAnswer of subAnswers) {
                if (subAnswer === userInputLowercase) {
                    return true;
                }
            }
            return false;
        } else {
            return this.anagramAnswers[0].toLowerCase() === userInputLowercase;
        }
    }

}