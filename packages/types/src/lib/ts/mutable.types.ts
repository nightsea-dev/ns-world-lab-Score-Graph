export type Mutable<T> = {
    -readonly [K in keyof T]:
    T[K] extends object
    ? Mutable<T[K]>
    : T[K]
}
export type DeepMutable<T> =
    T extends Function ? T :
    T extends readonly (infer U)[] ? DeepMutable<U>[] :
    T extends object ? { -readonly [K in keyof T]: DeepMutable<T[K]> } :
    T
