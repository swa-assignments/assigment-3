import { Generator, Position, Board} from '@/app/model/board'

class CyclicGenerator implements Generator<string> {
    private sequence: string
    private index: number

    constructor(sequence: string) {
        this.sequence = sequence
        this.index = 0
    }

    // @ts-ignore
    next(): string {
        const n = this.sequence.charAt(this.index)
        this.index = (this.index + 1) % this.sequence.length
        return n
    }
}

class GeneratorFake<T> implements Generator<T> {
    private upcoming: T[]

    constructor(...upcoming: T[]) {
        this.upcoming = upcoming
    }

    prepare(...e: T[]) {
        this.upcoming.push(...e)
    }

    // @ts-ignore
    next(): T {
        let v = this.upcoming.shift()
        if (v === undefined)
            throw new Error('Empty queue')
        else
            return v
    }

}

class GeneratorFake2<T> implements Generator<T> {
    private possibleTiles = ['A', 'B', 'C'];

    next(): T {
        // @ts-ignore
        return this.possibleTiles[Math.floor(Math.random() * this.possibleTiles.length)]
    }
}


export {CyclicGenerator, GeneratorFake, GeneratorFake2}