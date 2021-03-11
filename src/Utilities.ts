export function bitCount(n:number):number{
    return Math.ceil(Math.log2(n+1));
}
/**
 * Find the number of bytes needed to represent n
 * @param n a number
 */
export function bytesToRepresent(n:number):number{
    return Math.ceil(bitCount(n)/8);
}