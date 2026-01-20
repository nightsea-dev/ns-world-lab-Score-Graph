import {
    GraphEdge,
    GraphNode,
    GraphPayload
    , HasId, PartialGraphPayload
    , createID
    , createIdFor
} from "@ns-sg/types";
import { createGraphNodesFromText } from "./create-graph-node";

/**
 * * with [empty=[]] relationships
 */
export const createGraphPayload = ({
    nodes: nodes_IN = []
    , edges: edges_IN = []
} = {} as PartialGraphPayload
): GraphPayload => {
    const [nodes, edges] = [nodes_IN, edges_IN]
        .map(arr => arr.filter(Boolean).map(createIdFor)) as
        [GraphNode[], GraphEdge[]]
    return { nodes, edges }

}


    ,
    /**
     * * with [empty=[]] relationships
     */
    createGraphPayloadFromText = (
        text: string
    ): GraphPayload => createGraphPayload({
        nodes: createGraphNodesFromText(text)
    }) 
