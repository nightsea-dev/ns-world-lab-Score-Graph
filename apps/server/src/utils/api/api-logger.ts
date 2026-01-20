
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { timestamp, _t } from "@ns-sg/types";




export const requestLogger = ({
    name = "RequestLogger"
}: {
    name?: string
} = {}
): RequestHandler => {
    return (
        req
        , res
        , next
    ) => {
        const start = process.hrtime.bigint()
            , requestId =
                (req.headers["x-request-id"] as string | undefined) ??
                (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2))
            , {
                baseUrl
                , originalUrl
                , method
                , statusCode
                , query
                , params
                , path
                , route
                , url
            } = req


        res.setHeader("x-request-id", requestId);

        res.on("finish", () => {
            const end = process.hrtime.bigint()
                , ms = Number(end - start) / 1e6

                , ip =
                    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
                    req.socket.remoteAddress ??
                    ""

                , len = res.getHeader("content-length") ?? "-"

            console.log(
                [_t(), name].join(" ")
                // [_t(), `[${name}]`].join(" ")
                , {
                    requestId
                    , ip
                    , method
                    , originalUrl
                    , statusCode
                    , ms: `${ms.toFixed(1)}ms`
                    , len
                    , query: JSON.stringify(query, null, 2)
                    , params: JSON.stringify(params, null, 2)
                    , path
                    , route
                    , url
                }
                // , [
                //     `[${name}]`
                //     , requestId
                //     , ip
                //     , `${req.method} ${req.originalUrl}`
                //     , res.statusCode
                //     , `${ms.toFixed(1)}ms`
                //     , `len=${len}`
                //     ,
                // ].join(" ")
            );
        });

        next();
    };
}

    , errorLogger = ({
        name = "ErrorLogger"
    }: {
        name?: string
    } = {}
    ) => {
        return (err: unknown, req: Request, _res: Response, next: NextFunction) => {
            console.error(
                _t()
                , `[${name}] ERROR on ${req.method} ${req.originalUrl}`, err
            );
            next(err);
        };
    }
