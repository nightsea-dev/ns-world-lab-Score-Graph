// Colours.ts
// import { faker } from "@faker-js/faker"

// const BASE_COLORS = [
//     'rgb(255, 231, 117)',
//     'rgb(195, 241, 140)',
//     'rgb(255, 177, 177)',
//     'rgb(153, 220, 255)',
// ]
//= COLORS.map(s => [...s.match(/\d+/im) ?? []] as any as RgbColourArray)
// ========================================


export type RgbColourArray = [r: number, g: number, b: number]
export type RgbColourString = `rgb(${number}, ${number}, ${number})`
export type ColoursArray = RgbColourArray[]
export const RGB_KEYS = ["r", "g", "b"] as const
export type RgbColourKey = typeof RGB_KEYS[number]

type RgbColourMap = {
    [k in RgbColourKey]: number
}
export type HasToRgbString = {
    toRgbString(): string
}
export type RgbColour =
    & RgbColourArray
    & RgbColourMap
    & HasToRgbString

export const toRgbString = (
    ...args:
        | RgbColourArray
        | [colour: RgbColourArray]
        | number[]
        | [number[]]
) => {
    const str = args.flat(1).slice(0, 3).map(v => typeof v === "number" ? clamp8(v) : 0).join(", ")
    return `rgb(${str})` as RgbColourString
}

    , toRgbColour = (
        colourArray: RgbColourArray
    ) => {
        const o = Object.assign(
            [...colourArray]
            , Object.fromEntries(
                RGB_KEYS.map((k, i) => [k, colourArray[i]])
            ) as RgbColourMap
        ) as RgbColour
        return Object.defineProperty(
            o
            , "toRgbString"
            , {
                value: toRgbString.bind(o)
                , writable: false
            })
    }

export const BASE_COLORS = Object.freeze([
    [255, 231, 117],
    [195, 241, 140],
    [255, 177, 177],
    [153, 220, 255],
] as const) satisfies Readonly<ColoursArray> | ColoursArray

    , BASE_RGB_COLORS = Object.freeze(BASE_COLORS.map(toRgbColour))


// ========================================
const clamp8 = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
export const toHex2 = (n: number) => clamp8(n).toString(16).padStart(2, "0")
    , rgbToHex = (...args: RgbColourArray) => args.map(toHex2).join("")
// `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;

export type RandomFn = () => number // [0,1)
export type IntFn = (minInclusive: number, maxInclusive: number) => number

export type Rng = {
    random?: RandomFn
    int?: IntFn
}

const defaultRandomFn: RandomFn = () => Math.random()
    , defaultIntFn: IntFn = (min, max) => {
        const r = defaultRandomFn()
            , c = Math.ceil(min)
            , f = Math.floor(max)
        return Math.floor(r * (f - c + 1)) + c
    }
    , getRandomFn = (rng?: Rng) => rng?.random ?? defaultRandomFn
    , getIntFn = (rng?: Rng) => rng?.int ?? defaultIntFn


// ========================================
export type RgbColourArrayGeneratorFn = (baseColours: ColoursArray, rng?: Rng) => RgbColourArray;
const defaultGenerator: RgbColourArrayGeneratorFn = (
    baseColours
    , rng
) => {
    const int = getIntFn(rng)
    return baseColours[int(0, baseColours.length - 1)]
}


// ========================================
export type CreateColourHelperOptions =
    & {
        baseColours?: ColoursArray// = [...BASE_COLORS] as ColoursArray
        colourArrayGenerator?: RgbColourArrayGeneratorFn// = faker.helpers.arrayElement as RgbColourArrayGeneratorFn
        rngInt?: Rng
    }

// ========================================
export class ColoursHelper {

    private static _Instance?: ColoursHelper
    static get Instance() {
        return (this._Instance ??= Object.freeze(new ColoursHelper()))
    }

    constructor(
        options: CreateColourHelperOptions = {}
    ) {
        const {
            baseColours: _baseColours = [...BASE_COLORS] as ColoursArray
            , colourArrayGenerator: _colourArrayGenerator = defaultGenerator
            , rngInt: _rngInt
        } = options

        this._baseColours = _baseColours
        this._colourArrayGeneratorFn = _colourArrayGenerator
        this._rngInt = _rngInt


    }

    readonly _baseColours: ColoursArray
    readonly _colourArrayGeneratorFn: RgbColourArrayGeneratorFn
    readonly _rngInt?: Rng

    getRandomColour(
        baseColours: ColoursArray = this._baseColours
    ) {
        return toRgbColour(
            this._colourArrayGeneratorFn(baseColours, this._rngInt)
        )
        // return toRgbColour(
        //     baseColours[Math.floor(Math.random() * baseColours.length)]
        // )
    }

    /**
     * * FromBaseColours
     */
    getRandomColourRgbString(
        baseColours?: ColoursArray
    ) {
        return toRgbString(
            this.getRandomColour(baseColours)
        )
    }


    generateRandomColour(
        baseColours: ColoursArray = this._baseColours
        , colourArrayGenerator: RgbColourArrayGeneratorFn = this._colourArrayGeneratorFn
        , rngInt: Rng = this._rngInt ?? {}
    ) {
        return colourArrayGenerator(baseColours, rngInt)
    }

    generateRandomColorNearPalette(
        delta = 18
        , baseColours: ColoursArray = this._baseColours
        , rgbColourArrayGeneratorFn: RgbColourArrayGeneratorFn = this._colourArrayGeneratorFn
        , rngInt: Rng = this._rngInt ?? {}
    ) {
        const int = getIntFn(rngInt)
            , base = rgbColourArrayGeneratorFn(baseColours, rngInt)
            , jitteredColours: RgbColourArray =
                base.map(v => clamp8(v + int(-delta, delta))) as RgbColourArray

        return toRgbColour(
            jitteredColours
        )
    }
}


export const _colours = ColoursHelper.Instance

const {
    generateRandomColorNearPalette: _generateRandomColorNearPalette
    , generateRandomColour: _generateRandomColour
    , getRandomColour: _getRandomColour
    , getRandomColourRgbString: _getRandomColourRgbString
} = _colours
    , [
        generateRandomColorNearPalette
        , generateRandomColour
        , getRandomColour
        , getRandomColourRgbString
    ] = [
        _generateRandomColorNearPalette
        , _generateRandomColorNearPalette
        , _generateRandomColorNearPalette
        , _generateRandomColorNearPalette
    ].map(fn => fn.bind(_colours))

export {
    generateRandomColorNearPalette
    , generateRandomColour
    , getRandomColour
    , getRandomColourRgbString
}

