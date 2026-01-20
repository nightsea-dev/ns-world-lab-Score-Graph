
/**
 * * underline
 */
export const _u = (s: string) => `\x1b[4m${s}\x1b[0m`


    , _link = (
        url: string
        , label = url
    ) =>
        `\u001b]8;;${url}\u001b\\${label}\u001b]8;;\u001b\\`