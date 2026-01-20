import "dotenv/config";
import express from "express";
import cors from "cors";
import { getGraphApiRouter, GetGraphApiRouterProps } from "./api-router.js";
import { _link, _u } from "../../utils/node-only/index.js";

import path from "node:path";
import { errorLogger, requestLogger } from "../../index-lib.js";
import { entriesOf, ENV_KnowledgeGraph } from "@ns-sg/types";

const {
    DATABASE_SCHEMA_NAME: schemaName
    , DATABASE_URL: dbConnectionString
    , VITE_JACCARD_SIMILARITY_VERBOSE: JACCARD_SIMILARITY_VERBOSE
    , SCORE_GRAPH_DEFAULT_MinScore
    , SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphNodeDetails
    , SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphPayload
    , SCORE_GRAPH_VIEW_CONFIG_WaitSecondsBeforeShowingTheLoader
    , VITE_GRAPH_API_BASE: apiBase
    , VITE_GRAPH_API_GRAPH_ROUTER_BASE
    , VITE_GRAPH_API_HOST
    , VITE_GRAPH_API_PORT
    , VITE_HOST
    , VITE_PORT
} = ENV_KnowledgeGraph(process.env)

    , NAME = "GraphAPI" as const

    , schemaPath = path.join(process.cwd(), "schema.sql")

    , graphApiRouterProps = {
        dbConnectionString
        , schemaName
        , schemaPath
    } as GetGraphApiRouterProps

    , graph_api_host = VITE_GRAPH_API_HOST ?? "localhost"
    , graph_api_port = Number(VITE_GRAPH_API_PORT ?? 3001)
    , graph_api_target = `http://${graph_api_host}:${graph_api_port}`
    , vite_cors_origin_target = `http://${VITE_HOST}:${VITE_PORT}`// ?? "http://localhost:5173"

    , line = "=".repeat(process.stdout.columns ?? 100)


    // ----------------------------------------
    , runGraphApi = async () => {

        const {
            ROUTES: ROUTER_ROUTES
            , graphRouter
        } = await getGraphApiRouter(graphApiRouterProps)
            , graphRouterBase = "/graph" as const
            , FULL_ROUTES = Object.fromEntries(
                entriesOf(ROUTER_ROUTES).map(([k, v]) => [[graphRouterBase, k].join(""), v])
            )

            , app = express()
                .use(express.json({ limit: "1mb" }))
                .use(cors({ origin: vite_cors_origin_target }))
                .use(requestLogger({ name: NAME }))
                .get([apiBase, `${apiBase}/health`, `${apiBase}/routes`], (_req, res) => res.json({
                    health: { ok: true }
                    , ROUTER_ROUTES
                    , FULL_ROUTES
                }))
                .use(`${apiBase}${graphRouterBase}`, graphRouter)

                .use(errorLogger({ name: NAME }))

            , server = app.listen(graph_api_port, graph_api_host, () => {
                console.log(`
${line}
${NAME} Server listening on ${_u(_link(graph_api_target))}
${line}
`);
            })

        return { app, server }

    }

export const graphApi = {
    NAME
    , run: runGraphApi
}