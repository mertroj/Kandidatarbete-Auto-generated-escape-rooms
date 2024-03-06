export type point = [number, number]


export function getRandomInt(max: number) : number {
    return Math.floor(Math.random() * max);
}
export function getRandomIntRange(min: number, max: number) : number {
    return Math.floor(Math.random() * (max-min)) + min;
}