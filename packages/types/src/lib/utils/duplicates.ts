
export const deDup = <
    T extends {}
>(
    arr: Iterable<T>
) => [...new Set(arr)]
    .filter(Boolean)

    , deDupStrings = (
        arg_0: Iterable<string>
        , ignoreCase = true
    ) => {

        const arr2 = [...new Set(arg_0)]
            .map(v => {
                v = (v ?? "").trim()
                if (ignoreCase) {
                    v = v.toLowerCase()
                }
                return v
            })
            .filter(Boolean)

            , out = {
                dups: [] as string[]
                , nonDups: [] as string[]
            }

        arr2.forEach((v, i, arr) => {
            out[
                arr.indexOf(v) === i ? "nonDups" : "dups"
            ].push(v)
        })

        return out

    }


    // ========================================
    , findDupsOf = <T extends {}>(arg_0: Iterable<T> = []) => {
        const out = {
            dups: [] as T[]
            , nonDups: [] as T[]
        }
            ;[...new Set(arg_0)].forEach((v, i, arr) => {
                out[
                    (arr.indexOf(v) === i) ? "nonDups" : "dups"
                ].push(v)
            })
        return {
            nonDups: out.nonDups
            , dups: [...new Set(out.dups)]
        } as typeof out
    }



// ========================================
/**
 * * defaults:
 *      * byNormalized = true
 *      * lower = true
 *      * trim = true
 * @warn heavy
 */
export type FindDuplicateStringsOptions = {
    trim: boolean;
    lower: boolean;
    byNormalized: boolean;
}

export type FindDuplicateStringsEntry = {
    value: string
    count: number
    originals?: string[]
}

export type FindDuplicateStringsReturnType
    = FindDuplicateStringsEntry[]

export const findDuplicateStrings = (
    arr: Iterable<string>,
    opts?: Partial<FindDuplicateStringsOptions>
): FindDuplicateStringsReturnType => {
    const {
        byNormalized = true
        , lower = true
        , trim = true
    } = opts ?? {}
        , norm = (s: string) => {
            let v = s ?? "";
            if (trim) {
                v = v.trim()
            }
            if (lower) {
                v = v.toLowerCase()
            }
            return v;
        }
        , counts = new Map<string, number>()
        , originals = new Map<string, Set<string>>()

    for (const raw of arr) {
        const rawSafe = (raw ?? "")
            , key = norm(rawSafe)
        if (!key) {
            continue
        }

        counts.set(key, (counts.get(key) ?? 0) + 1);

        if (!originals.has(key)) {
            originals.set(key, new Set())
        }
        originals.get(key)!.add(trim ? rawSafe.trim() : rawSafe)
    }

    const out: FindDuplicateStringsReturnType = []

    for (const [key, count] of counts) {
        if (count > 1) {
            out.push({
                value: byNormalized ? key : (originals.get(key)?.values().next().value ?? key),
                count,
                originals: Array.from(originals.get(key) ?? []),
            });
        }
    }

    out.sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))

    return out
}
