export type point = [number, number]


export function randomInt(max: number) : number {
    return Math.floor(Math.random() * max);
}
export function randomIntRange(min: number, max: number) : number {
    return Math.floor(Math.random() * (max-min)) + min;
}
export function randomChoice(array: any[]): string {
    return array[randomInt(array.length)];
}