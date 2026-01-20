import { PickPrefixedKeys } from "../../../../../composites/index.js";
import { EdgeWithScore, Topic } from "../../../contracts/index.js";

export type TopicOutgoingEdgeWithScoreRow =
    & Topic
    & PickPrefixedKeys<
        "edge_"
        , EdgeWithScore
        , "score" | "target_id"
    >



const {

} = {} as EdgeWithScore
