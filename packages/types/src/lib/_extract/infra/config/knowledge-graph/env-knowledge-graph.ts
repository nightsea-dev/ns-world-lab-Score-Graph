/**
 * ---
 *  * SPECIALISED
 * --
 * * KnowledgeGraph (only)
 */

export type EnvironmentSource = Record<string, unknown>;

export const ENV_KnowledgeGraph = (env: EnvironmentSource) => ({
    // =========================
    // Server-only
    // =========================
    DATABASE_URL:
        (env.DATABASE_URL as string)
        ?? "postgres://spider:Sherice1!@lab36:5432/ns_world_lab",

    DATABASE_SCHEMA_NAME:
        (env.DATABASE_SCHEMA_NAME as string)
        ?? "knowledge_graph_1",

    VITE_JACCARD_SIMILARITY_VERBOSE:
        env.VITE_JACCARD_SIMILARITY_VERBOSE === "true",


    // =========================
    // Shared (VITE_*)
    // =========================
    VITE_HOST:
        (env.VITE_HOST as string)
        ?? "lab36",

    VITE_PORT:
        Number(env.VITE_PORT) || 5173,

    VITE_GRAPH_API_HOST:
        (env.VITE_GRAPH_API_HOST as string)
        ?? "lab36",

    VITE_GRAPH_API_PORT:
        Number(env.VITE_GRAPH_API_PORT) || 3001,

    VITE_GRAPH_API_BASE:
        (env.VITE_GRAPH_API_BASE as string)
        ?? "/api",

    VITE_GRAPH_API_GRAPH_ROUTER_BASE:
        (env.VITE_GRAPH_API_GRAPH_ROUTER_BASE as string)
        ?? "/graph",


    // =========================
    // ScoreGraph (web logic)
    // =========================
    VITE_SCORE_GRAPH_DEFAULT_MinScore:
        Number(env.VITE_SCORE_GRAPH_DEFAULT_MinScore) || 0.15,

    VITE_SCORE_GRAPH_VIEW_CONFIG_WaitSecondsBeforeShowingTheLoader:
        Number(env.VITE_SCORE_GRAPH_VIEW_CONFIG_WaitSecondsBeforeShowingTheLoader) || 2,

    VITE_SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphPayload:
        env.VITE_SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphPayload === "true",

    VITE_SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphNodeDetails:
        env.VITE_SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphNodeDetails === "true",
});
