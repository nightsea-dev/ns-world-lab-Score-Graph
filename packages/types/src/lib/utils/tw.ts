export const _tw = (
    strings: TemplateStringsArray,
    ...expr: Array<string | false | null | undefined>
): string => {
    let out = "";

    for (let i = 0; i < strings.length; i++) {
        out += strings[i];
        if (typeof expr[i] === "string") {
            out += expr[i];
        }
    }

    return out.trim().replace(/\s+/g, " ");
};
