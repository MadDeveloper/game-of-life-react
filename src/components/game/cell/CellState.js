export const CellState = {
    ALIVE: 1,
    DEAD: 0
}

export function pickRandomState() {
    const randomBool = !!Math.round(Math.random())

    if (randomBool) {
        return CellState.ALIVE
    }

    return CellState.DEAD
}