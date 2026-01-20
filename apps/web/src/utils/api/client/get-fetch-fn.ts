// GENERIC
import { compile } from "path-to-regexp";
import { _t, RouteFetchFnRestArgs } from "@ns-sg/types";

type AnyRoute = string;
type AnyRouteMap = Record<string, unknown>;

// ========================================
export type GetFetchFnProps = {
    //  graph_api_target: string 
    graph_api_host: string
    graph_api_port: string | number
    graph_api_base: string
    graph_api_router_base: string
}

export type FetchFnReturnType<
    TRoutes extends AnyRoute
    , TResponses extends AnyRouteMap
    , RK extends TRoutes
> = {
    response?: Response;
    json?: TResponses[RK];
    error?: Error;
}

// ========================================
export const getFetchFn = <
    TRoutes extends AnyRoute
    , TResponses extends AnyRouteMap
>({
    graph_api_base
    , graph_api_host
    , graph_api_port
    , graph_api_router_base
}: GetFetchFnProps
) => {

    const graph_api_target = `http://${graph_api_host}:${graph_api_port}${graph_api_base}${graph_api_router_base}`

    return {
        graph_api_target
        , _fetch: async <
            RK extends TRoutes
        >(
            route: RK
            , ...rest: RouteFetchFnRestArgs<RK>
        ): Promise<FetchFnReturnType<TRoutes, TResponses, RK>> => {

            const hasParams = route.includes("/:")

                , params = (hasParams ? rest[0] : undefined) as any

                , init = (hasParams ? rest[1] : rest[0]) as RequestInit | undefined

                , path = params ? compile(String(route))(params) : String(route)

                , input = `${graph_api_target}${path}`

                , info = {
                    graph_api_target
                    , input
                    , init
                    , route
                    , rest
                    , path
                    , params
                }

            let response: Response

            try {
                response = await fetch(input, init);
            } catch (fetchError) {
                const error = Object.assign(
                    // fetchError instanceof Error ? fetchError : new Error(`${_t()} [ERROR]\ninput:${input}`)
                    new Error(`${_t()} FETCH ERROR
input: ${input}
`)
                    , {
                        fetchError
                        , info
                    }
                )
                console.error(error)
                return { error }
            }

            if (!response.ok) {
                console.log(info)
                debugger
                const body = await response.text().catch(() => "")
                    , error = Object.assign(
                        new Error(`${_t()} RESPONSE ERROR`)
                        , {
                            status: response.status
                            , statusText: response.statusText
                            , body
                            , info
                        }
                    )
                console.error(error)
                return { response, error }
            }

            try {
                const json = (await response.json()) as TResponses[RK]
                return { response, json }
            } catch (jsonParseError) {
                const error = Object.assign(
                    new Error(`${_t()} JSON PARSE ERROR`)
                    , {
                        jsonParseError
                        , info
                    }
                )
                console.error(error)
                return { response, error }
            }
        }
    }
};
