// GENERIC can go into [lib]

type QueryAction = "select" | "upsert" | "delete"

export type QueryFn =
    | (<T>(...args: any[]) => Promise<T[]>)
    | ((...args: any[]) => Promise<any>)

export type QueryEntry = {
    /**
     * * sql
     */
    command: string
    /**
     * * query
     */
    fn: QueryFn
}
export type QueryActionMap<
    AK extends QueryAction = QueryAction
    , V extends any = any
> =
    | {
        [k in AK]: V
    }
    | {
        [k in `${AK}_${string}`]: V
    }
    | {
        [k in `${AK}_`]: never
    }
    | {
        [k in `${AK}_${string}_`]: never
    }



export type SqlQueryEntityQueriesMap<
    AK extends QueryAction = QueryAction
> = QueryActionMap<AK, QueryEntry>



export type SqlQueryMap<
    TN extends string
    , AK extends QueryAction = QueryAction
> = Partial<{
    [k in TN]: QueryActionMap<AK, QueryEntry>
}>

export type SqlCommandMap<
    TN extends string
    , AK extends QueryAction = QueryAction
> = Partial<{
    [k in TN]: QueryActionMap<AK, string>
}>
