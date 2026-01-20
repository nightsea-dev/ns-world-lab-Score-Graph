
import { useRef, useState } from "react";
import {
    _cb, _effect, _memo, _t, _use_state
    , capitalise
    , ENV_KnowledgeGraph
    , HasData,
    isNumber,
    isUnitInterval,
    EventWKindMapInfo,
    PrefixKeysAndCapitalisedAfter,
    ID,
    HasError,
    pickFrom,
    PickRestPartial,
    KeyOf,
} from "@ns-sg/types";
import { normaliseStringsFn, NormaliseStringsInput, StringValue } from "../../utils";
import {
    ControlButtonsGroupEventInfo,
    ButtonsCollectionProps,
    ControlPanel
    , ControlPanelEventInfo, ControlPanelProps
} from "./control";
import { API, ComputedGraphPayloadResponse, GraphNodeDetailsResponse } from "../../api";
import { GraphNodeDetailsPanel } from "./node";
import {
    GraphCaseCollection
    , GraphCaseCollectionProps
} from "./cases";
import { ForceGraph2DWrapper, ForceGraph2DWrapperProps } from "./graph";
import { ElapsedTimer, ElapsedTimerProps, ErrorBox, LoaderDiv, ObjectView, OverlayLoader } from "../../components";
import { CLEAR_GRAPH_PAYLOAD_AND_INPUT_TEXT, CLEAR_GRAPH_SELECTED, CLEAR_STATE_COMMAND, requestCommand, ScoreGraphState, ScoreGraphStateCommandKind, ScoreGraphStateStateStatusBase } from "../../state";

type TimerInfo =
    Partial<{
        started: number
        elapsedSeconds: number
        finished: number
        lapsed_ms?: number
        lapsed?: string
    }>
const CLEAR_TIMER = {
    elapsedSeconds: undefined
    , finished: undefined
    , lapsed: undefined
    , lapsed_ms: undefined
    , started: undefined
} as TimerInfo

// ======================================== config

const {
    VITE_SCORE_GRAPH_DEFAULT_MinScore: DEFAULT_MinScore
    , VITE_SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphNodeDetails: CONFIG_LoadIsDisabled_GraphNodeDetails
    , VITE_SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphPayload: CONFIG_LoadIsDisabled_GraphPayload
    , VITE_SCORE_GRAPH_VIEW_CONFIG_WaitSecondsBeforeShowingTheLoader: CONFIG_WaitSecondsBeforeShowingTheLoader
    , VITE_GRAPH_API_HOST
    , VITE_GRAPH_API_PORT
} = ENV_KnowledgeGraph(import.meta.env)




// ======================================== events
export type _EV_INFO = EventWKindMapInfo<
    // & Record<ScoreGraphStateCommandKind, ScoreGraphStateCommand>
    & PrefixKeysAndCapitalisedAfter<"controlButtons_", ControlButtonsGroupEventInfo["_sourceEventsMap"]>
    & PrefixKeysAndCapitalisedAfter<"controlPanel_", ControlPanelEventInfo["_sourceEventsMap"]>
    & {
        error: HasError
    }
>

export {
    type _EV_INFO as ScoreGraphEventInfo
}


// ======================================== state - from local.types
type State = ScoreGraphState

// ======================================== props
export type ScoreGraphViewProps =
    & Partial<
        & HasData<StringValue>
        & Pick<ControlPanelProps, "subject" | "minScore">
        & {
            title: string
            doDefaultAction: boolean
        }
    >



// ======================================== component
/**
 * * [DB access] is currently happening at this level
 * * need to move it to a [state] => zustand
 */
export const ScoreGraphView = ({
    title = "[title]" //  "Knowledge Graph"
    , subject = "[subject]"
    , data: data_IN //= "PR, press release, newsroom, analytics, SEO, distribution"
    , minScore: minScore_IN
    , doDefaultAction = false
    , ...rest
} = {} as ScoreGraphViewProps
) => {

    type InternalState = {
        overlayState: | "SHOWN" | "HIDDEN" //| "REQUESTED"
    }

    const [state, _set_state]
        = _use_state<State>({
            minScore: DEFAULT_MinScore
            , isFirstRender: true
            // , showOverlay: false
            , ...CLEAR_STATE_COMMAND
        })

        , [internalState, _set_internalState] = _use_state<InternalState>({
            overlayState: "HIDDEN"
        })

        , [timer, _set_timer] = _use_state<TimerInfo>(CLEAR_TIMER)

        , _set_state_textInput = (
            {
                input
                , ...rest
            }:
                & {
                    input: NormaliseStringsInput
                }
                & Partial<Pick<State, "stateCommand" | "selected_GraphCaseData">>
        ) => {

            _set_state({
                ...rest
                , textInput: normaliseStringsFn(input).join(", ")
            })

        }

        ,
        /**
         * outside only
         */
        isDoingSomething = _memo([state.stateCommand], () => {
            switch (state.stateCommand?.status) {
                case "IDLE": {
                    return false
                }
                case "REQUESTED":
                case "PROCESSING":
                case "LOADING":
                case "BUILDING": {
                    return true
                }
                default: {
                    return false
                }
            }
        })

        , sourceLabels = normaliseStringsFn(state.textInput)

        , overlayInfo = {
            timer
            , ...pickFrom(state
                , "stateCommand"
                , "textInput"
                , "minScore"
                , "selected_GraphCaseData"
            )
            , sourceLabels
        }
        , controlPanelInfo = {
            ...pickFrom(state
                , "stateCommand"
                , "textInput"
                , "minScore"
                , "previous_selected_NodeId"
                , "selected_NodeId"
                , "score"
            )
            , internalState
            , sourceLabels
            , isDoingSomething
            , timer
            , "API._info": API._info
        }


        , _validateResponse = (
            response:
                | ComputedGraphPayloadResponse
                | GraphNodeDetailsResponse
        ) => {
            console.log(`${_t()} VALIDATING [response]`, {
                response
            })
            if (!response) {
                const error = new Error("Got no [response]. Something's WRONG")
                console.error(error)
                _set_state({ error })
                _set_state({
                    ...CLEAR_STATE_COMMAND
                })
                return false
            }
            return true
        }


        , _handleCommand = async () => {

            const {
                stateCommand
            } = state

            if (!stateCommand
                || stateCommand.status !== "REQUESTED"
                || stateCommand.status as ScoreGraphStateStateStatusBase === "PROCESSING"
            ) {
                return
            }

            const started = Date.now()
            _set_timer({
                ...CLEAR_TIMER
                , started
            })

            console.log(`${_t()} [_getGraphPayload] | STARTED
action: ${stateCommand}            
            `)
            _set_state({
                stateCommand: {
                    ...stateCommand
                    , status: "PROCESSING"
                }
            })

            await (
                async () => {
                    switch (stateCommand.command) {
                        case "LOAD [GraphPayload] from [DB]": {
                            if (!CONFIG_LoadIsDisabled_GraphPayload) {
                                return
                            }

                            _set_state({
                                ...CLEAR_GRAPH_SELECTED
                                , computedGraphPayload: undefined
                                , stateCommand: {
                                    ...stateCommand
                                    , status: "LOADING"
                                }
                            })
                            const response = await API.graph.load_GraphPayload_fromDB()
                            if (!_validateResponse(response)) {
                                return
                            }
                            const {
                                data: computedGraphPayload
                            } = response
                            _set_state({
                                computedGraphPayload
                            })
                            return
                        }
                        case "BUILD [GraphPayload] from [textInput]": {
                            if (!CONFIG_LoadIsDisabled_GraphPayload) {
                                return
                            }

                            const {
                                textInput
                                , minScore
                            } = state

                                , sourceLabels = normaliseStringsFn(textInput)

                            if (!sourceLabels.length) {
                                _set_state({
                                    error: new Error("[textInput.length: 0] no [labels] to build the [graph] from.")
                                })
                                return
                            }
                            _set_state(p => ({
                                ...p
                                , stateCommand: {
                                    ...stateCommand
                                    , status: "BUILDING"
                                }
                                , textInput: sourceLabels.join(", ")
                            }))
                            const response = await API.graph.build_GraphPayload_fromSourceLabels({
                                sourceLabels
                                , minScore
                            })
                            if (!_validateResponse(response)) {
                                return
                            }

                            const {
                                data: computedGraphPayload
                                , error
                            } = response

                            _set_state({
                                computedGraphPayload
                                , error
                            })
                            _set_state(CLEAR_STATE_COMMAND)
                            break
                        }
                        case "LOAD [GraphNodeDetail] from [DB]": {
                            if (!CONFIG_LoadIsDisabled_GraphNodeDetails) {
                                return
                            }
                            _set_state({
                                ...CLEAR_GRAPH_SELECTED
                                , selected_NodeWithDetails: undefined
                                , stateCommand: {
                                    ...stateCommand
                                    , status: "LOADING"
                                }
                            })

                            const {
                                selected_NodeId
                            } = state
                            if (!selected_NodeId) {
                                return
                            }

                            const response = await API.topic.get_GraphNodeDetails({
                                id: selected_NodeId
                            })
                            if (!_validateResponse(response)) {
                                return
                            }
                            const {
                                data: selected_NodeWithDetails
                                , data: {
                                    node: {
                                        id
                                    } = {}
                                } = {}
                            } = response
                            _set_state({
                                selected_NodeWithDetails
                                , selected_NodeId: id
                                , previous_selected_NodeId: id
                            })
                            return

                        }

                    }
                })()
                .finally(() => {
                    const finished = Date.now()
                        , lapsed_ms = finished - started
                    _set_state({
                        ...CLEAR_STATE_COMMAND
                    })
                    console.log(`${_t()} [${_handleCommand.name}] | FINISHED after ${lapsed_ms.toFixed(2)}s
action: ${stateCommand}
                    `)
                    _set_state({
                        lapsed_ms
                    })
                    _set_timer({
                        finished
                        , lapsed_ms
                        , lapsed: (lapsed_ms / 1000).toFixed(3) + " s"
                    })
                })
        }

        , _requestCommand = <
            C extends ScoreGraphStateCommandKind
        >(
            command: C
            , p?: Partial<State>
        ) => {
            const stateCommand = requestCommand(command)
            _set_state({
                ...p
                , stateCommand
            })
            return stateCommand
        }

        , _handle_ControlButtonClick: ButtonsCollectionProps["onButtonClick"]
            = ({
                buttonKind
            }) => {
                switch (buttonKind) {
                    case "build": {
                        _requestCommand("BUILD [GraphPayload] from [textInput]")
                        break;
                    }
                    case "load": {
                        _requestCommand("LOAD [GraphPayload] from [DB]")
                        break;
                    }
                    case "clear": {
                        _set_state({
                            ...CLEAR_GRAPH_SELECTED
                            , ...CLEAR_GRAPH_PAYLOAD_AND_INPUT_TEXT
                        })
                        break
                    }
                }
            }




    // ----------------------------------------
    type ChangeTriggers =
        | "[state.selected_GraphCaseData] changed"
        | "[state.selected_NodeId] changed"

    const _handle_Change = (
        trigger: ChangeTriggers
    ) => {

        switch (trigger) {
            case "[state.selected_NodeId] changed": {
                _requestCommand("LOAD [GraphNodeDetail] from [DB]")
                break
            }
            case "[state.selected_GraphCaseData] changed": {
                if (!state.selected_GraphCaseData) {
                    return
                }
                const {
                    selected_GraphCaseData: {
                        items: input = []
                    } = {}
                } = state
                if (!input.length) {
                    return
                }
                _set_state_textInput({ input })
                _requestCommand("BUILD [GraphPayload] from [textInput]")
                break
            }

        }
    }

    _effect([data_IN], () => {
        const sourceLabels = normaliseStringsFn(data_IN)
        if (!sourceLabels.length) {
            return
        }
        _set_state_textInput({ input: sourceLabels })
        console.log(`${_t()} [textInput] set from [data_IN]`, { data_IN, sourceLabels })

    })



    _effect([state.selected_NodeId], () => {
        if (!state.selected_NodeId
            || state.selected_NodeId === state.previous_selected_NodeId
        ) {
            return
        }
        _handle_Change("[state.selected_NodeId] changed")
    })


    _effect([minScore_IN], () => {
        if (!isNumber(minScore_IN)) {
            return
        }
        if (!isUnitInterval(minScore_IN)) {
            console.error(
                new Error(`${_t()} [minScore] must be within range [0..1]. [minScore: ${minScore_IN}] will be ignored.`)
            )
            return
        }
        _set_state({
            minScore: minScore_IN
        })
    })

    _effect([state.selected_GraphCaseData], () => {
        if (!state.selected_GraphCaseData) {
            return
        }
        _handle_Change("[state.selected_GraphCaseData] changed")
    })

    _effect([state.stateCommand], () => {//, isDoingSomething], () => {
        console.log("state.stateCommand", state.stateCommand)
        _handleCommand()

        const isIDLE = !state.stateCommand || (state.stateCommand.status === "IDLE")

        if (isIDLE) {
            _set_internalState({
                overlayState: "HIDDEN"
            })
            return
        }
        if (internalState.overlayState === "SHOWN") {
            return
        }

        const id = setTimeout(() => {
            _set_state(p1 => {
                _set_internalState(p2 => {
                    // debugger
                    const overlayState = p1.stateCommand?.status === "IDLE" ? "HIDDEN" : "SHOWN"
                    return {
                        ...p2
                        , overlayState
                    }
                })
                return p1
            })
        }, CONFIG_WaitSecondsBeforeShowingTheLoader * 1000)

        return () => clearTimeout(id)
    })



    _effect([], () => {
        // bootstrapping
        _set_state({ isFirstRender: false })
        if (!doDefaultAction) {
            return
        }

        const id = setTimeout(() => {

            _set_state(s => {
                const sourceLabels = normaliseStringsFn(s.textInput)

                if (!s.computedGraphPayload
                    && !isDoingSomething
                    && sourceLabels?.length
                    && !s.error
                ) {
                    _requestCommand("LOAD [GraphPayload] from [DB]")
                }
                return s
            })
        }, 2000)

        return () => clearTimeout(id)

    })


    return (
        // <ScoreGraphContext.Provider
        //     value={state}
        //     onChange={_set_state}
        // >
        <div
            {...rest}
            data-scoring-graph
            // className="max-w-[1100px] mx-auto my-6 px-4"
            className="w-screen h-screen overflow-hidden"
        >
            <OverlayLoader
                show={internalState.overlayState === "SHOWN"}
            >
                <div>
                    Loading ... <ElapsedTimer
                        onTick={_set_timer}
                    />
                    <div>
                        <ObjectView
                            data={overlayInfo}
                            showStringArraysAsTags
                            stringTags_withRandomColour
                        />
                    </div>
                </div>
            </OverlayLoader>

            <div
                data-header
                className="text-[24px] font-bold w-max p-4"
            >
                {title}
            </div>

            <div
                data-content
                className="grid h-full min-h-0 grid-cols-[1.2fr_0.8fr] gap-4 relative"
            >
                <div
                    data-force-graph-wrapper-container
                    className="min-h-0 overflow-auto mt-[10px]"
                >
                    <ForceGraph2DWrapper
                        data={state.computedGraphPayload}
                        selected_NodeId={state.selected_NodeId}
                        onSelect={_set_state}
                    />
                </div>

                <div
                    data-right-content-container
                    // className="border-2 border-green-50"
                    className="relative min-h-0 overflow-auto border-2 border-green-50"
                    style={{
                        // border: "1px solid red"
                        maxHeight: "100%"
                    }}
                >

                    <ControlPanel
                        textInput={state.textInput}
                        minScore={state.minScore}
                        subject={capitalise(subject, { eachWord: true })}
                        message={(
                            <div>
                                Enter [{subject}], build a relationship graph, click nodes to inspect related [{subject}] and scores.
                            </div>)}
                        buttonsAreDisabled={isDoingSomething}
                        infoData={controlPanelInfo}
                        onChange={_set_state}
                        onButtonClick={_handle_ControlButtonClick}
                    />
                    <ErrorBox
                        data={state.error}
                    />
                    <GraphNodeDetailsPanel
                        data={state.selected_NodeWithDetails}
                        disabled={!state.computedGraphPayload?.nodes}
                    />
                    <GraphCaseCollection
                        selected_CaseCategory={state.selected_GraphCaseCategory}
                        onSelect={_set_state}
                    />
                </div>



            </div>
        </div>
        // </ScoreGraphContext.Provider>
    )
}



