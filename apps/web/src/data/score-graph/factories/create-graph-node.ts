import { createID, GraphNode, PickRestPartial } from "@ns-sg/types"
import { normaliseStringsFn } from "../../../utils"
// import { faker } from "faker"


type FactoryGeneratedNodeWithId
    = PickRestPartial<GraphNode, "id">

/**
 * * we just [assign] [ids] and create the [GraphNode] structure
 */
export const createGraphNode = (
    o = {} as Partial<GraphNode>
): FactoryGeneratedNodeWithId => ({
    ...o
    , id: o.id ?? createID()
})

    ,
    /**
     * * we just [assign] [ids] and create the [GraphNode] structure
     */
    createGraphNodesFromText = (
        text: string
    ): GraphNode[] =>
        normaliseStringsFn(text)
            .map(label => ({
                id: createID()
                , label
            }))

    ,
    /**
     * * we just [assign] [ids] and create the [GraphNode] structure
     */
    createGraphNodes = (
        ...args: Partial<GraphNode>[]
    ): FactoryGeneratedNodeWithId[] =>
        args.filter(Boolean).map(createGraphNode)

