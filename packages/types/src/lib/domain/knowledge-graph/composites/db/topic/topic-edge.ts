import { HasPartialAuditTimestamps } from "../../../../../capabilities/index.js"
import { EdgeWithScore, Topic } from "../../../contracts/index.js"

/**
 * * EdgeWithScore<Topic["id"]>
 */
export type TopicEdge =
    & EdgeWithScore<Topic["id"]>


export type TopicEdgeRow =
    & TopicEdge
    & HasPartialAuditTimestamps<"created_at">
