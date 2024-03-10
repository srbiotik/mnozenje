
export function getMultiplicationPairs(low, high) {
    if (low > high) {
        throw new Error("Low end of range must be less than or equal to high end.");
    }

    const randomNumber1 = Math.floor(Math.random() * (high - low + 1)) + low;
    const randomNumber2 = Math.floor(Math.random() * (high - low + 1)) + low;
    return [randomNumber1, randomNumber2];
}
