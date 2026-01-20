// SPECIALISED for the KnowledgeGraph
import { EdgeWithScore, timestamp, Topic_API, TopicEdge_API, TopicOutgoingEdgeWithScoreRow } from "@ns-sg/types";
import { createDbWrapper, CreateDbWrapperProps } from "../../index-lib.js";
import { getSqlCommandMap, KnowledgeGraphQueryMap } from "./sql-command-map.js";

// ========================================
export type GetSqlQueryMapProps = CreateDbWrapperProps
// ========================================
/**
 * ---
 * * [SQL command] => [DB]
 * --
 * [DAL]
 */
export const getSqlQueryMap = async (
    props: GetSqlQueryMapProps
) => {
    const db = await createDbWrapper(props)
        , {
            sqlQuery
            , parseLimit
            , selectWithLimit
            , schemaName
            , queryFn
        } = db
        , {
            SQL_COMMAND_MAP
            , SQL_COMMAND_MAP: SQL
        } = getSqlCommandMap(schemaName)

        ,
        /**
         * *
         */
        SQL_QUERY_MAP = {
            topic: {
                async select(
                    limit?: number
                ) {
                    return await selectWithLimit<Topic_API>({
                        command: SQL.topic.select
                        , limit
                    })
                }
                , async select_ById(
                    id: Topic_API["id"]
                ) {
                    return await sqlQuery<Topic_API>(
                        SQL.topic.select_ById
                        , [id]
                    ).catch(queryError => {
                        const newError = Object.assign(
                            new Error(`[${timestamp()}] QUERY ERROR`)
                            , {
                                error: queryError
                                , "SQL.topic.select_ById": SQL.topic.select_ById
                                , params: [id]
                            }
                        )
                        console.error(newError)
                        throw newError
                    })
                    // return await sqlQuery<Topic_API>(
                    //     SQL.topic.select_ById
                    //     , [id]
                    // )
                }
                , async upsert<T extends Topic_API = Topic_API>(
                    ...labels: T["label"][]
                ) {
                    const inserted = [] as T[]
                    await Promise.all(
                        labels.map(async label => {
                            const { rows } = await sqlQuery<T>(
                                SQL.topic.upsert
                                , [label]
                            )
                            inserted.push(...rows)
                        })
                    )
                    return { inserted }
                }
            }
            , topic_edge: {
                async upsert(
                    ...edges: TopicEdge_API[]
                    // [e.s, e.t, e.score]
                ) {
                    const inserted = [] as EdgeWithScore[]
                    await Promise.all(
                        edges.map(async ({
                            source_id, target_id, score
                        }) => {
                            const { rows } = await sqlQuery<EdgeWithScore>(
                                SQL.topic_edge.upsert
                                , [source_id, target_id, score]
                            )
                            inserted.push(...rows)
                        })
                    )
                    return { inserted }

                }
                , async select_WithinTopicIds(
                    ...topicIds: Topic_API["id"][]
                ) {
                    return await sqlQuery<EdgeWithScore>(
                        SQL.topic_edge.select_WithinTopicIds
                        , [topicIds]
                    )
                }
                , async select(
                    limit?: number
                ) {
                    return await selectWithLimit<EdgeWithScore>({
                        command: SQL.topic_edge.select
                        , limit
                    })
                }

                , async select_OutgoingEdgesByTopicId(
                    topicId: Topic_API["id"]
                    , limit_IN = 0
                ) {
                    const {
                        limit
                        , limitSql
                    } = parseLimit(limit_IN)
                    return await sqlQuery<TopicOutgoingEdgeWithScoreRow>(
                        SQL.topic_edge.select_OutgoingEdgesByTopicId
                        + (limitSql ?? "")
                        + ";"
                        , [
                            topicId
                            , limit
                        ].filter(Boolean)
                    )
                }

            }

        } satisfies KnowledgeGraphQueryMap

    return {
        SQL_QUERY_MAP
        , SQL_COMMAND_MAP
        , db
    }
}


export type SQL_QUERY_MAP = Awaited<ReturnType<typeof getSqlQueryMap>>["SQL_QUERY_MAP"]
