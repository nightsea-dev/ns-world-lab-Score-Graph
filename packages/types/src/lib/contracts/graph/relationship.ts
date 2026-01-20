
export type Relationship<
    Sc extends any = unknown
    , Tgt extends any = Sc
    , Px extends string = ""
    , Sx extends string = ""
> =
    & {
        [k in `${Px}source${Sx}`]: Sc
    }
    & {
        [k in `${Px}target${Sx}`]: Tgt
    }

export type RelationshipWithPrefixedKey<
    Px extends string
    , Sc extends any = unknown
    , Tgt extends any = Sc
> = Relationship<Sc, Tgt, Px>

export type RelationshipWithSuffixedKey<
    Sx extends string
    , Sc extends any = unknown
    , Tgt extends any = Sc
> = Relationship<Sc, Tgt, "", Sx>



