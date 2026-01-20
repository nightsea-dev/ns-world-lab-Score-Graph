import { KeyOf } from "../ts/key-of.types.js";
import { entriesOf } from "./entries-of.util.js";




export const pickFrom = <
    T extends object
    , K extends KeyOf<T>
>(
    o: T
    , ...keys: K[]
): Pick<T, K> => Object.fromEntries(
    entriesOf(o).filter(([k]) => keys.includes(k as K))
) as Pick<T, K>



    , omitFrom = <
        T extends object
        , K extends KeyOf<T>
    >(
        o: T
        , ...keys: K[]
    ): Omit<T, K> => Object.fromEntries(
        entriesOf(o).filter(([k]) => !keys.includes(k as K))
    ) as any as Omit<T, K>


