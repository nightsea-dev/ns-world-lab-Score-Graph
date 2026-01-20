export const isNumber = (
    v: unknown
): v is number => typeof v === "number" && Number.isFinite(v)


    , isString = (
        v: unknown
    ): v is string => typeof v === "string"