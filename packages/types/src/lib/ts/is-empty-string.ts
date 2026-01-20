export type IsEmptyString<T extends string> =
    T extends "" ? true : false