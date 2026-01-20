import { Flattened } from "../ts/index.js"



export const flattenKeys = <T extends Record<string, any>>(
    obj: T
): Flattened<T> => {
    const result: Record<string, any> = {}

    function walk(
        current: Record<string, any>,
        prefix = ""
    ) {
        for (const key in current) {
            const value = current[key]
            const path = prefix ? `${prefix}.${key}` : key

            if (
                value !== null &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {
                walk(value, path)
            } else {
                result[path] = value
            }
        }
    }

    walk(obj)
    return result as Flattened<T>
}
