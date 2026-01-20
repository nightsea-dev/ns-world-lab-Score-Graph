import { HasId, HasLabel, HasPartialAuditTimestamps } from "../../../../capabilities/index.js"

export type Topic =
    & HasId
    & HasLabel

export type TopicRow =
    & Topic
    & HasPartialAuditTimestamps<"created_at">
