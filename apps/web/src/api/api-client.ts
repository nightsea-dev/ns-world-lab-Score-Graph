// SPECIALISED
import {
    ENV_KnowledgeGraph,
    GraphApi_ResponsesMap
    , GraphApi_RouteKey
    , GraphData_UI, GraphNodeDetails, GraphPayload, HasData, HasPartialData, HasPartialError, TopicDetail_UI
    , flattenKeys, lowercaseKeys

} from "@ns-sg/types";
import { getFetchFn } from "../utils";

// ======================================== config
const {
    VITE_SCORE_GRAPH_DEFAULT_MinScore: DEFAULT_MinScore
    , VITE_GRAPH_API_BASE: graph_api_base
    , VITE_GRAPH_API_HOST: graph_api_host
    , VITE_GRAPH_API_PORT: graph_api_port
    , VITE_GRAPH_API_GRAPH_ROUTER_BASE: graph_api_router_base
    , VITE_HOST
    , VITE_PORT
} = ENV_KnowledgeGraph(import.meta.env)

    // ======================================== helpers
    , {
        _fetch
        , graph_api_target
    } = getFetchFn<GraphApi_RouteKey, GraphApi_ResponsesMap>({
        graph_api_base
        , graph_api_host
        , graph_api_port
        , graph_api_router_base
    })

// ======================================== types

export type ComputedGraphPayloadResponse =
    & HasPartialData<GraphPayload>
    & HasPartialError

export type GraphNodeDetailsResponse =
    & HasPartialData<GraphNodeDetails>
    & HasPartialError

// ======================================== out - API_client
/**
 * * API cient
 */
export const API = {
    _info: {
        graph_api_base
        , graph_api_host
        , graph_api_port
        , graph_api_router_base
        , graph_api_target
    }
    , graph: {
        build_GraphPayload_fromSourceLabels: async ({
            sourceLabels
            , minScore = DEFAULT_MinScore
        }: {
            sourceLabels: string[]
            , minScore?: number// = 0.15
        }): Promise<ComputedGraphPayloadResponse> => {
            const {
                response
                , json
                , error
            } = await _fetch("/build"
                , {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topics: sourceLabels, minScore })
                });
            if (error) {
                const err = Object.assign(
                    error
                    , {
                        msg: `Build failed: ${response?.status}`
                        , response
                    }
                )
                console.error(err)
                return {
                    error: err
                }
                // throw err
            }
            // const {
            //     data
            //     , data: {
            //         edges
            //         , nodes
            //     }
            // } = json!

            // return { data }
            return json!

        }
        , load_GraphPayload_fromDB: async (): Promise<ComputedGraphPayloadResponse> => {
            const {
                json
                , response
                , error: fetchError
            } = await _fetch(`/`);
            if (fetchError) {
                const error = Object.assign(
                    fetchError
                    , {
                        msg: `Fetch [graph] failed: ${response?.status}`
                        , response
                    }
                )
                console.error(error)
                return { error }
                // throw err
            }
            // const {
            //     data
            //     // , data: {
            //     //     edges
            //     //     , nodes
            //     // }
            // } = json!
            // return { data }
            return json!
        }
    }
    , topic: {
        get_GraphNodeDetails: async ({
            id
        }: {
            id: string
        }): Promise<
            GraphNodeDetailsResponse
        > => {
            const {
                json
                , response
                , error: fetchError
            } = await _fetch(`/topics/:id`
                , { id }
            );
            if (fetchError) {
                const error = Object.assign(
                    fetchError
                    , {
                        msg: `Fetch [topic] failed: ${response?.status}`
                        , response
                    }
                )
                console.error(error)
                return { error }
                // throw error
            }

            const {
                data
                , data: {
                    edges: outgoingEdges
                    , nodes: [node]
                }
            } = json!

            return {
                data: {
                    node
                    , outgoingEdges
                }
            }
        }
    }
}

