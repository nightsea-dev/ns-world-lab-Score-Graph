import { ComponentProps, createContext, useContext } from "react";
import {
    _use_state
    , HasPartialValue
    , PartialOrFull, PartialOrFullFnOf
    , _t,
    EventWKindMapInfo,
} from "@ns-sg/types";
import { ScoreGraphState } from "./ScoreGraph.state";




/**
 * ---
 * * [Data] only
 */
export type ScoreGraphCtxData =
    & ScoreGraphState
// & Partial<
//     & {
//         minScore: number
//         sourceLabels: string[]
//         computedGraphPayload: GraphPayload
//         selectedNodeId: string
//         selectedNodeDetails: GraphNodeWithDetails
//         error: Error
//         isFirstRender: boolean
//         action: ScoreGraphAction
//         showLoader: boolean;
//     }
//     & GraphCasesBoxEvent<"select">
// >

type ScoreGraphCtxDataKey = keyof ScoreGraphCtxData

/**
 * @disabled
 * ---
 * * [Data] + [Behaviour]
 */
export type ScoreGraphCtx =
    & Partial<
        & ScoreGraphCtxData
    >
    & {
        _set: PartialOrFullFnOf<ScoreGraphCtxData>
    }

const ScoreGraphContextBase
    = createContext<ScoreGraphCtx | undefined>(undefined)

    , _PROVIDER_ = ScoreGraphContextBase.Provider

// ======================================== props
// @todo => use Zustand
type _EV_INFO = EventWKindMapInfo<{
    change: ScoreGraphCtxData
    test: {}
}>
type FullHandlers = _EV_INFO["Handlers"]
export {
    type FullHandlers as ScoreGraphContextEventHandlers
}

export type ScoreGraphContextProviderProps =
    & Omit<ComponentProps<typeof _PROVIDER_>, "value">
    & HasPartialValue<ScoreGraphCtxData>
    & Partial<FullHandlers>


// ======================================== context
let COUNTER = 0

export const ScoreGraphContext
    = Object.assign(
        ScoreGraphContextBase as Omit<typeof ScoreGraphContextBase, "Provider">
        , {
            Provider: (
                {
                    value
                    , onChange
                    , ...rest
                } = {} as ScoreGraphContextProviderProps
            ) => {

                const [state, _set_state]
                    = _use_state(value)

                    , ctx = state as ScoreGraphCtx

                ctx._set = <
                    K extends ScoreGraphCtxDataKey
                >(
                    partial: PartialOrFull<ScoreGraphCtxData, K>
                ) => {

                    _set_state(p => {

                        const next = {
                            ...p
                            , ...partial
                        }
                            ;
                        // ; !onChange
                        //     || setTimeout(() => onChange(next as any))

                        return next

                    })
                }

                console.log(`${_t()} ScoreGraphContext: ${COUNTER++}`)

                return (
                    <_PROVIDER_
                        {...rest}
                        value={ctx}
                    />
                )

            }
        }
    )


    , useScoreGraphContext = () => {
        const ctx = useContext(ScoreGraphContextBase)
        if (!ctx) {
            throw new Error(`Must be within a [ScoreGraphContext]`)
        }
        return ctx
    }