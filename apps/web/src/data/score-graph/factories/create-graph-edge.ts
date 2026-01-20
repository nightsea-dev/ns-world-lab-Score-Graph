import { createID, GraphEdge, GraphNode, PickRestPartial } from "@ns-sg/types"
// import { faker } from "faker"




export const createGraphEdge = (
    o = {} as Partial<GraphEdge>
): PickRestPartial<GraphEdge, "id"> => ({
    ...o
    , id: o.id ?? createID()
})

    , createGraphEdgeFromNodes = (
        ...[sourceNode, targetNode]: [GraphNode, GraphNode]
    ): PickRestPartial<GraphEdge, "id" | "source_id" | "target_id"> => ({
        id: createID()
        , source_id: sourceNode.id ?? createID()
        , target_id: targetNode.id ?? createID()
    })