export type point = [number, number]

export function around(pos: point): point[]  {
    let [x, y] = pos;
    return [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
}

export function randomInt(max: number) : number {
    return Math.floor(Math.random() * max);
}
export function randomIntRange(min: number, max: number) : number {
    return Math.floor(Math.random() * (max-min)) + min;
}
export function randomFloatRange(min: number, max: number) : number {
    return Math.random() * (max-min) + min;
}
export function randomFloat(max: number) : number {
    return Math.random() * max;
}
export function range(start: number, end: number, step?: number) {
    if (!step) step = 1;
    let cur = start;
    let nums: number[] = [];
    while (cur < end) {
        nums.push(cur);
        cur += step;
    } 
    return nums;
}
export function choice<t>(array: t[]): t {
    return array[randomInt(array.length)];
}
export function frequencies<t>(array: [number,t][]): t{
    let total = array.map((a) => a[0]).reduce((acc, val) => acc+val);
    let choice = Math.random()*total;
    let i = 0;
    while (choice > array[i][0]) {
        choice -= array[i++][0];
    }
    return array[i][1];
}
export function repeat<t>(n: number, fn: () => t): t[] {
    let array = new Array(n);
    for (let i=0; i < n; i++) {
        array[i] = fn()
    }
    return array
}
export function removeDuplicates<t>(array: t[]): t[] {
    return [...new Set(array)];
}

export function shuffleArray<t>(array: t[]): t[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}