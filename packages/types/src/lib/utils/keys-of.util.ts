import { KeyOf } from "../ts/index.js";

export const keysOf = <T extends object>(o: T) =>
    Object.keys(o) as KeyOf<T>[]

