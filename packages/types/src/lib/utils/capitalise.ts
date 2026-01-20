

// ========================================
export type CapitaliseOptions = {
    /**
     * * Capitalize every word
     */
    eachWord?: boolean
    /**
     * * Force the rest to lowercase
     */
    lowerRest?: boolean

    /**
     * * Locale-aware casing (optional)
     */
    locale?: string
}


// ========================================
export const capitalise = (
    input: string,
    {
        eachWord = false,
        lowerRest = false,
        locale,
    }: CapitaliseOptions = {}
): string => {

    if (!input) {
        return input
    }

    const upper = (s: string) =>
        locale ? s.toLocaleUpperCase(locale) : s.toUpperCase()

        , lower = (s: string) =>
            locale ? s.toLocaleLowerCase(locale) : s.toLowerCase()

        , cap = (word: string) =>
            upper(word[0]) + (lowerRest ? lower(word.slice(1)) : word.slice(1))

    if (!eachWord) {
        return cap(input);
    }

    // Unicode word-aware split
    return input.replace(/\p{L}+/gu, word => cap(word))
}
