import { ApiResponse } from "../../../composites/index.js"
import { GraphDataBase } from "../../../contracts/index.js"
import { Topic, TopicOutgoingEdgeWithScoreRow } from "../../../domain/index.js"
import { KeyOf } from "../../../ts/index.js"
import { ApiRoutesMapOf } from "../../api/index.js"
import { GraphData_API } from "./graph-data.js"



/**
 * ---
 * SPECIALISED
 * --
 * * for **KnowledgeGraph**
 * * knownRoutes (DEMO only)
 */
export type GraphApi_ResponsesMap = {
    "/": ApiResponse<GraphData_API>
    , "/build": ApiResponse<GraphData_API>
    , "/topics/:id": ApiResponse<
        GraphDataBase<
            Topic
            , TopicOutgoingEdgeWithScoreRow
        >
    >
}

/**
 * ---
 * SPECIALISED
 * --
 * * for **KnowledgeGraph**
 * * knownRoutes (DEMO only)
 */
export type GraphApi_RouteKey = KeyOf<GraphApi_ResponsesMap>
/**
 * ---
 * SPECIALISED
 * --
 * * for **KnowledgeGraph**
 * * knownRoutes (DEMO only)
 */
export type GraphApi_Routes = ApiRoutesMapOf<GraphApi_RouteKey>
/**
 * ---
 * SPECIALISED
 * --
 * * for **KnowledgeGraph**
 * * knownRoutes (DEMO only)
 */
export type GraphApi_ResponseOf<
    RK extends GraphApi_RouteKey = GraphApi_RouteKey
> = GraphApi_ResponsesMap[RK]


