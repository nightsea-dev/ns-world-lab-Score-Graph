import { Pool } from "pg"


const parseLimit = (
    limit = 0
    , p = 1
) => {
    limit = (typeof (limit) === "number") ? Math.max(0, limit) : 0
    return limit <= 0
        ? {}
        : {
            limit
            , limitSql: (limit > 0 ? `LIMIT $${p}::number` : "")
        }
}

export const createHelpers = (
    pool: Pool
) => {

    return {
        parseLimit
        , selectWithLimit: async <TRow extends object>({
            limit: limit_IN
            , command
        }: {
            limit?: number
            command: string
        }) => {
            const {
                limit
                , limitSql
            } = parseLimit(limit_IN)
            return await pool.query<TRow>(
                command
                + (limitSql ?? "")
                + ";"
                , [limit].filter(Boolean)
            )

        }

    }

}



