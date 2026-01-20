import fs from "node:fs";
import { Pool, QueryArrayResult, QueryConfig, QueryConfigValues, QueryResult, QueryResultRow } from "pg";
import { createHelpers } from "./db-query-helpers.js";
import { isIdent } from "../../utils/index.js";
import { PickRestPartial } from "@ns-sg/types";


export type CreatePoolProps = {
    dbConnectionString: string
    schemaPath: string
    schemaName: string
}

const createPool = async (
    props: CreatePoolProps
) => {
    const {
        dbConnectionString
        , schemaPath
        , schemaName
    } = props
        , o = {
            cwd: process.cwd()
            , ...props
        }
        , o_str = JSON.stringify(o, null, 2)

    if (!isIdent(schemaName)) {
        throw new Error(`Invalid [schemaName: ${schemaName}]
${o_str}
`)
    }

    const schemaFileExists = fs.existsSync(schemaPath)

    if (!schemaFileExists) {
        const err = new Error(`[schemaPath: "${schemaPath}"] does not exist.
${o_str}
`)
        console.error(err)
        throw err
    }
    const schema = fs.readFileSync(schemaPath, "utf-8")
        , pool = new Pool({ connectionString: dbConnectionString })
        , client = await pool.connect()

    try {
        await client.query("BEGIN")
        await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`)
        await client.query(`SET search_path TO ${schemaName}, pg_catalog`)
        // await client.query(`SET search_path TO ${schemaName}, public, pg_catalog`)
        await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`)
        await client.query(schema)
        await client.query("COMMIT")
    } catch (e) {
        await client.query("ROLLBACK")
        throw e
    } finally {
        client.release()
    }

    // const q = ((
    //     ...args
    // ) => {

    //     pool.query(...args)
    //     .then()

    // }) as typeof pool.query
    type QueryFn = <
        R extends QueryResultRow = any
        , I = any[]
    >(
        queryTextOrConfig: string | QueryConfig<I>,
        values?: QueryConfigValues<I>,
    ) => Promise<QueryResult<R>>


    const originalQueryFn = pool.query.bind(pool)

    type QueryFnReturnTypeBase<
        R extends QueryResultRow = any
    > = {
        value: QueryResult<R>
        error?: Error
    }

    type QueryFnReturnType<
        R extends QueryResultRow = any
        , I = any[]
    > =
        & QueryFnReturnTypeBase<R>
        & {
            queryTextOrConfig: string | QueryConfig<I>
            queryConfigValues?: QueryConfigValues<I>
        }

    type QFn<R extends QueryResultRow = any, I = any[]> = (
        queryTextOrConfig: string | QueryConfig<I>,
        values?: QueryConfigValues<I>,
    ) => Promise<QueryResult<R>>

    const queryFn = async<
        R extends QueryResultRow = any
        , I = any[]
    >(
        queryTextOrConfig: string | QueryConfig<I>
        , queryConfigValues?: QueryConfigValues<I>
    ): Promise<QueryFnReturnType<R, I>> => {

        const {
            value
            , error: queryError
        } = (await (pool.query as QFn<R, I>)(queryTextOrConfig, queryConfigValues)
            .then(value => ({ value }))
            .catch(error => ({ error }))) as PickRestPartial<QueryFnReturnTypeBase<R>, "value">

        let error = queryError

        if (queryError) {
            error = Object.assign(
                new Error(`QUERY_ERROR`)
                , { queryTextOrConfig, queryConfigValues, queryError }
            )
            console.error(error)
        }


        return {
            queryTextOrConfig
            , queryConfigValues
            , value
            , error
        }


    }

    return { pool, schema, queryFn }
}

// ========================================
export type CreateDbWrapperProps = CreatePoolProps
// ========================================
export const createDbWrapper = async (
    props: CreatePoolProps
) => {

    const r = await createPool(props)

    return {
        ...r
        , ...props
        , sqlQuery: r.pool.query.bind(r.pool)
        , ...createHelpers(r.pool)
    }

}



