

import { useEffect, useReducer, useRef, useState } from "react"
import { _effect, EventHandlersFromMap, HasEventHandler, HasEventHandlersFromMap, PickHtmlAttributes } from "@ns-sg/types"


type _EV_MAP = {
    tick: {
        elapsedSeconds: number
    }
}

// ========================================
export type ElapsedTimerProps =
    Partial<
        & PickHtmlAttributes<"className">
        & {
            start: boolean
            intervalMs: number
        }
        & HasEventHandlersFromMap<_EV_MAP>

    >

// ========================================
export const ElapsedTimer = ({
    start = true
    , intervalMs = 1000
    , onTick
    , ...rest
}: ElapsedTimerProps
) => {

    const [elapsedSeconds, _tick] = useReducer(x => x + 1, 1)
        , onTickRef = useRef<typeof onTick>(onTick)

    onTickRef.current = onTick

    _effect([elapsedSeconds], () => {
        onTickRef.current?.({ elapsedSeconds })
    })

    _effect([start, intervalMs], () => {

        if (!start) {
            return
        }

        const id = window.setInterval(() => {
            _tick()
        }, intervalMs)

        return () => {
            window.clearInterval(id)
        }
    })

    return (
        <span
            {...rest}
            data-elapsed-timer
            className={`mx-4 ${rest.className ?? ""}`}
        >
            {elapsedSeconds}s
        </span>
    )
}
