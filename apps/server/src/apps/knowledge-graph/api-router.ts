// SPECIALISED for the KnowledgeGraph
import { Router } from "express";
import { ApiInput } from "./api-input.js";
import { scoreTopicSimilarity } from "./logic/score-topic-similarity.js";
import { getSqlQueryMap, GetSqlQueryMapProps } from "./sql-query-map.js";
import { entriesOf, GraphApi_ResponseOf, GraphApi_Routes } from "@ns-sg/types";
// ========================================


type ROUTES = Awaited<ReturnType<typeof getGraphApiRouter>>["ROUTES"]

// type Responses = {
//     [k in keyof ROUTES]: any
// }
// const ApiResponses = {
//     "/": {} as ApiResponse<ApiGraphData>
//     , "/build": {} as ApiResponse<ApiGraphData | undefined>
//     , "/topics/:id": {} as ApiResponse<
//         GraphData<
//             TopicRow
//             , TopicOutgoingEdgeWithScoreRow
//         >
//     >
// } as Responses



// ========================================
export type GetGraphApiRouterProps = GetSqlQueryMapProps
export const getGraphApiRouter = async (
    props: GetGraphApiRouterProps
) => {

    const {
        SQL_QUERY_MAP: Q
    } = await getSqlQueryMap(props)

        , ROUTES = {

            /**
             * POST /api/graph/build
             * Body: { topics: string[], minScore?: number }
             *
             * Creates/updates topics, computes edges (pairwise), stores edges with score >= minScore.
             * Returns graph payload (nodes + edges).
             */
            "/build": {
                method: "post"
                , handler: async (req, res) => {
                    const parsed = ApiInput.safeParse(req.body);
                    if (!parsed.success) {
                        return res.status(400).json({ error: parsed.error.flatten() });
                    }

                    const { topics, minScore } = parsed.data;

                    // Normalize + de-dup labels
                    const labels = Array.from(
                        new Set(topics.map((t) => t.trim()).filter(Boolean))
                    );

                    if (labels.length <= 0) {
                        return res.status(400).json({ error: "[topics] are required." })
                    }

                    const {
                        error
                        , graphData
                    } = await scoreTopicSimilarity({
                        minScore
                        , topics
                        , SQL_QUERY_MAP: Q
                    })

                    if (error) {
                        const {
                            name
                            , message
                            , cause
                            , stack
                        } = error
                        return res.status(400).json({
                            error: name
                            , message
                            , cause
                            , stack
                        })
                    }

                    console.log({ graphData })

                    return res.json({
                        data: graphData
                    } as GraphApi_ResponseOf<"/build">)

                }
            }

            ,
            /**
             * GET /api/graph
             * Returns full graph (cap optional via query params later if needed).
             */
            "/": {
                method: "get"
                , handler: async (_req, res) => {
                    const { rows: nodes } = await Q.topic.select()
                        , { rows: edges } = await Q.topic_edge.select()

                    res.json({
                        data: {
                            edges
                            , nodes
                        }
                    } as GraphApi_ResponseOf<"/">);
                }
            }

            ,
            /**
             * GET /api/topic/:id
             * Returns node + related topics by descending score.
             */
            "/topics/:id": {
                method: "get"
                , handler: async (req, res) => {
                    const { id } = req.params
                        , { rows: nodes = [] } = await Q.topic.select_ById(id)

                    if (!nodes.length) {
                        return res.status(404).json({
                            error: `Topic with [id: ${id}] was not found.`
                        });
                    }

                    const {
                        rows: edges
                    } = await Q.topic_edge.select_OutgoingEdgesByTopicId(id)

                    res.json({
                        data: {
                            edges
                            , nodes
                        }
                    } as GraphApi_ResponseOf<"/topics/:id">);
                }
            }

        } as const satisfies GraphApi_Routes
    // ========================================

    const graphRouter = Router()

    entriesOf(ROUTES)
        .forEach(([k, {
            method
            , handler
        }]) => {
            graphRouter[method](k, handler)
        })

    return { graphRouter, ROUTES }

}