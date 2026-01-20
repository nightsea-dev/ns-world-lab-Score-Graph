
export type RouteKey = string
export type ExtractRouteParams<
    RK extends RouteKey
> =
    RK extends `${string}:${infer P}/${infer R}`
    ? { [K in P | keyof ExtractRouteParams<R>]: string }
    : RK extends `${string}:${infer P}`
    ? { [K in P]: string }
    : {};

export type RouteFetchFnRestArgs<
    RK extends RouteKey
> =
    keyof ExtractRouteParams<RK> extends never
    ? [init?: RequestInit]
    : [params: ExtractRouteParams<RK>, init?: RequestInit];


export type HasParams<
    RK extends RouteKey
> =
    keyof ExtractRouteParams<RK> extends never ? false : true


export function routeParams<
    RK extends RouteKey,
    P extends ExtractRouteParams<RK>
>(route: RK, params: P): P {
    return params;
}
