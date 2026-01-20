// SPECIALISED for the KnowledgeGraph
import { ApiInput } from "../api-input.js"
import { SQL_QUERY_MAP } from "../sql-query-map.js"
import { scoreStringRelationships } from "../../../scoring/index.js"
import { deDup, GraphData_API, Topic, Topic_API, TopicEdge_API } from "@ns-sg/types"

// ========================================
export type ScoreTopicSimilarityProps =
    & ApiInput
    & {
        SQL_QUERY_MAP: SQL_QUERY_MAP
    }
// ========================================
export const scoreTopicSimilarity = async (
    {
        topics
        , minScore
        , SQL_QUERY_MAP: Q
    }: ScoreTopicSimilarityProps
): Promise<
    | {
        graphData: GraphData_API
        error?: never
    }
    | {
        graphData?: never
        error: Error
    }
> => {

    const labels = deDup(topics)

        // Upsert topics
        , { inserted: insertedTopics }
            = await Q.topic.upsert(...labels)

        , topicIds = insertedTopics.map(({ id }) => id)

        , labelsSet = new Set<string>()

        , topicsByLabel = new Map(
            insertedTopics.map((o) => {
                const { label } = o
                labelsSet.add(label)
                return [
                    label
                    , o
                ] as [Topic_API["label"], Topic_API]
            })
        )
        , _tid = (s: string) => topicsByLabel.get(s)!.id

        , {
            scoredRelationships
            , error
        } = scoreStringRelationships({
            minScore
            , strings: labelsSet
        })

    if (error) {
        return { error }
    }

    const edgesToUpsert: TopicEdge_API[]
        = scoredRelationships.map(({
            source, target, score
        }) => {
            const [source_id, target_id]
                = [source, target].map(_tid)
            return {
                source_id, target_id, score
            } as TopicEdge_API
        })


        , { inserted: insertedEdges }
            = await Q.topic_edge.upsert(...edgesToUpsert)

        , { rows: edges }
            = await Q.topic_edge.select_WithinTopicIds(...topicIds)

    return {
        graphData: {
            nodes: insertedTopics
            , edges
        }
    }

}