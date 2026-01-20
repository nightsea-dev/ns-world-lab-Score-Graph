import { KeyOf } from "../ts/index.js";

type HasDuplicates<
    T extends readonly unknown[],
    Seen extends readonly unknown[] = []
> =
    T extends readonly [infer H, ...infer R]
    ? H extends Seen[number]
    ? true
    : HasDuplicates<R, [...Seen, H]>
    : false;

type NoDuplicates<T extends readonly unknown[]> =
    HasDuplicates<T> extends true ? never : T;

    
export const createUndefinedFor =
    <T extends object>() =>
        <const Keys extends readonly KeyOf<T>[]>(
            ...keys: NoDuplicates<Keys>
        ) => {
            return Object.fromEntries(
                keys.map(k => [k, undefined])
            ) as { [K in Keys[number]]?: T[K] };
        };
