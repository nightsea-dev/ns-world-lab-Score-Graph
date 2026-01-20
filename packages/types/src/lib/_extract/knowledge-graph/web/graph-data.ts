import { HasEdges } from "../../../capabilities/has-edge.js"
import { HasNode, HasNodes } from "../../../capabilities/has-node.js"
import { GraphDataBase } from "../../../contracts/index.js"
import { Topic, TopicEdge, TopicOutgoingEdgeWithScoreRow } from "../../../domain/index.js"

export type GraphData_API = GraphDataBase<Topic, TopicEdge>
export type Topic_API = GraphData_API["nodes"][number]
export type TopicEdge_API = GraphData_API["edges"][number]

/**
 * * same as: GraphData_API
 */
export type GraphData_UI = GraphData_API
/**
 * * GraphNode
 */
export type Topic_UI = GraphData_UI["nodes"][number]
/**
 * * GraphEdge
 */
export type TopicEdge_UI = GraphData_UI["edges"][number]

/**
 * * TopicDetailNode_UI
 */
export type TopicDetail_UI =
    & HasNode<Topic_UI>
    & {
        /**
         * * TopicOutgoingEdgeWithScoreRow
         */
        outgoingEdges: TopicOutgoingEdgeWithScoreRow[]
    }
export type TopicDetailNode_UI = TopicDetail_UI["node"]
export type TopicDetailEdge_UI = TopicDetail_UI["outgoingEdges"][number]


// ======================================== more generic
export type GraphNode = Topic_UI
export type GraphNodeWithDetails = TopicDetail_UI
export type GraphEdge = TopicEdge_UI
export type GraphPayload =
    & HasNodes<GraphNode>
    & HasEdges<GraphEdge>

export type PartialGraphPayload =
    Partial<{
        [k in keyof GraphPayload]: Partial<GraphPayload[k]>
    }>

export type GraphNodeDetails = TopicDetail_UI