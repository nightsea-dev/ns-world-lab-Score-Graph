
export type HasScore<
    Px extends string = ""
> = {
        [k in `${Px}score`]: number
    }

// export type HasScoreWithPrefixedKeyAndCapitalised<
//     P extends string
//     , T extends object
// > =
//     & HasPrefixedKeyAndCapitalised<P, T>