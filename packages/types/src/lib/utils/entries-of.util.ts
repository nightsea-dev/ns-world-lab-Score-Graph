import { EntryOf } from "../ts/index.js";

export const entriesOf = <T extends object>(o: T) =>
    Object.entries(o) as EntryOf<T>[]
