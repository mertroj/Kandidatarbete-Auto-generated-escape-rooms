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
export function repeat<t>(n: number, fn: Function): t[] {
    let array = new Array(n);
    for (let i=0; i < n; i++) {
        array[i] = fn()
    }
    return array
}