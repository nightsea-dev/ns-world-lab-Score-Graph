import { RequestHandler } from "express"

export type ApiMethod = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
export type ApiRouteKey = string
export type ApiRoutesMapOf<
    RK extends ApiRouteKey = ApiRouteKey
> = {
        [k in RK]: {
            method: ApiMethod
            handler: RequestHandler
        }
    }


export type HasApiMethod<
    AM extends ApiMethod = ApiMethod
> = {
    method: AM
}
