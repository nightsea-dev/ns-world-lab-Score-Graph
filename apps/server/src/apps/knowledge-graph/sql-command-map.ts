// SPECIALISED for the KnowledgeGraph

import { QueryFn, SqlCommandMap } from "@ns-sg/types"

export type KnowledgeGraphDbTableName
    = "topic" | "topic_edge"

// ========================================
/**
 * ---
 * * Pure [SQL] commands
 * --
 * [strings] only
 */
export const getSqlCommandMap = <
    TSchemaName extends string
>(
    schemaName: TSchemaName
) => {

    const SQL_COMMAND_MAP = {
        topic: {
            select: `
                    SELECT    id
                                    , label 
                    FROM ${schemaName}.topic 
                    ORDER BY label`

            , select_ById: `
                    SELECT    id
                                    , label 
                    FROM ${schemaName}.topic 
                    WHERE id = $1::uuid;`

            , upsert: `
                    INSERT INTO ${schemaName}.topic(label) VALUES ($1)
                    ON CONFLICT(label) DO UPDATE SET label=EXCLUDED.label
                    RETURNING id, label;
                    `
        }
        , topic_edge: {
            upsert: `
                    INSERT INTO ${schemaName}.topic_edge(
                        source_id
                        , target_id
                        , score
                        )
                    VALUES ($1, $2, $3)
                    ON CONFLICT(source_id, target_id) DO UPDATE SET score=EXCLUDED.score;
                    `
            , select_WithinTopicIds: `
                    SELECT    id
                                    , source_id
                                    , target_id, score
                    FROM ${schemaName}.topic_edge
                    WHERE source_id = ANY($1::uuid[])
                    AND target_id = ANY($1::uuid[]);
                    `
            , select: `
                    SELECT    id
                                    , source_id
                                    , target_id
                                    , score 
                    FROM ${schemaName}.topic_edge`

            , select_OutgoingEdgesByTopicId: `
                    SELECT     t.id
                                    , t.label
                                    , e.score           as edge_score
                                    , e.target_id     as edge_target_id
                    FROM ${schemaName}.topic_edge e
                    JOIN ${schemaName}.topic t ON t.id = e.target_id
                    WHERE e.source_id = $1::uuid
                    ORDER BY e.score DESC, t.label ASC
                    `

        }
    } as const satisfies SqlCommandMap<KnowledgeGraphDbTableName>


    return { SQL_COMMAND_MAP }
}

type SQL_COMMAND_MAP = ReturnType<typeof getSqlCommandMap>["SQL_COMMAND_MAP"]

export type KnowledgeGraphQueryMap =
    {
        [k in keyof SQL_COMMAND_MAP]: {
            -readonly [a in keyof SQL_COMMAND_MAP[k]]: QueryFn
        }
    }

