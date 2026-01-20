import {
    _effect, _memo, _use_state
    , _cb,
    isUnitInterval,
    ENV_KnowledgeGraph,
    EventWKindMapInfo,
    GraphPayload,
    pickFrom,
    KeyOf,
    _tw,
    ValueOf,
} from "@ns-sg/types"
import { ReactNode } from "react"
import { ButtonsCollectionProps, ControlButtons } from "./ControlButtons"
import { InputProps, NumberInput, NumberInputProps, Textarea, TextareaProps, Toggle } from "rsuite"
import { ObjectView, ObjectViewProps, ToggleGroup } from "../../../components"
import { normaliseStringsFn } from "../../../utils"

const {
    VITE_SCORE_GRAPH_DEFAULT_MinScore: DEFAULT_MinScore = .15
} = ENV_KnowledgeGraph(import.meta.env)


// ======================================== data
type _MUTABLE_DATA = {
    textInput: string
    minScore: number
}
type _MUTABLE_VALUE = ValueOf<_MUTABLE_DATA>

// ======================================== events
type _EV_INFO =
    & EventWKindMapInfo<
        {
            change: _MUTABLE_DATA
            init: _MUTABLE_DATA
        }
    >

export {
    type _EV_INFO as ControlPanelEventInfo
}


// ======================================== props
export type ControlPanelPropsData =
    & _MUTABLE_DATA
    & {
        subject: string
        message: ReactNode
    }

type State =
    & _MUTABLE_DATA
    & {
        isFirstRender: boolean
        show_state_info_box: boolean
    }


// ======================================== props
export type ControlPanelProps =
    & Partial<
        & ControlPanelPropsData
        & _EV_INFO["Handlers"]
        & {
            buttonsAreDisabled: boolean
            infoData: ObjectViewProps<any>["data"]
        }
        & Pick<ButtonsCollectionProps, "onButtonClick">
    >

const _CSS = {
    textInput: _tw`
        h-40 w-full resize-none 
        rounded-md border border-slate-200 
        bg-white px-3 py-2 
        text-[14px]
        text-slate-900 
        outline-none 
        focus:border-slate-400
    `

    , minScore: _tw`
        text-center w-18 rounded-md border border-slate-200 bg-white px-1 py-1 text-sm text-slate-900 outline-none focus:border-slate-400
    `
} as Record<keyof _MUTABLE_DATA, string>

    , INPUT_PROPS = {
        minScore: {
            type: "number"
            , step: 0.01
            , min: 0
            , max: 1
        } //as NumberInputProps

        , textInput: {
            placeholder: "press release\nmedia coverage\nanalytics dashboard"
        } //as TextareaProps
    } as const satisfies Record<keyof _MUTABLE_DATA,
        | NumberInputProps
        | TextareaProps
    >

// ======================================== component
export const ControlPanel = ({
    subject = "[subject]"
    , message

    , textInput: textInput_IN
    , minScore: minScore_IN
    , buttonsAreDisabled: buttonsAreDisabled_IN
    , infoData

    , onChange
    , onInit
    , onButtonClick
    , ...rest
}: ControlPanelProps
) => {

    type InputEvent = {
        currentTarget: { value: string | number | null }
    }
    type InputValue = InputEvent | _MUTABLE_VALUE

    if (isNaN(DEFAULT_MinScore)) {
        const error = new Error(`Something's WRONG! [isNaN(DEFAULT_MinScore)]
This tipically happens when the [.env...DEFAULT_MinScore] can't be read.
DEFAULT_MinScore: ${String(DEFAULT_MinScore)}
            `)
        console.error(error)
        debugger
    }

    const [state, _set_state] = _use_state<State>({
        textInput: ""
        , minScore: DEFAULT_MinScore
        , isFirstRender: true
        , show_state_info_box: false
    })

        , sourceLabels = normaliseStringsFn(state.textInput)
        , buttonsAreDisabled = buttonsAreDisabled_IN || !sourceLabels.length

        ,
        /**
         * * will [emit]
         */
        _handleChange = (
            ...[k, v]: [k: KeyOf<_MUTABLE_DATA>, v: _MUTABLE_VALUE]
        ) => {
            const next = {
                ...state
                , [k]: k === "minScore" ? Number(v) : String(v)
            }
            _set_state(next)
            onChange?.({
                __eventKind: "change"
                , ...next
            })

        }



    _effect([textInput_IN], () => {
        if ((textInput_IN ??= "") === state.textInput) {
            return
        }
        _set_state({
            textInput: textInput_IN
        })
    })

    _effect([minScore_IN], () => {
        if (!isUnitInterval(minScore_IN)) {
            const error = new Error(`[minScore] must be within range [0..1]. [minScore: ${minScore_IN}] will be ignored.`)
            console.warn(error)
            // _emitEvent({ eventKind: "error", error })
            return
        }
        if (minScore_IN === state.minScore) {
            return
        }
        debugger
        _set_state({
            minScore: minScore_IN
        })
    })


    _effect([state.isFirstRender, state.minScore, state.textInput], () => {
        // bootstrapping
        if (state.isFirstRender) {
            return
        }
        onInit?.({
            __eventKind: "init"
            , ...state
        })
    })


    _effect([], () => {
        _set_state({ isFirstRender: false })
    })

    return (
        <div
            {...rest}
            data-control-panel
            className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-2xl font-semibold text-slate-900">
                        {subject}
                    </div>
                    <div className="mt-0.5  text-slate-800 bg-gray-50 py-1 px-4 border-[1px] border-gray-100 rounded-[10px]">
                        {message}
                    </div>
                </div>
            </div>
            <div className="mt-3 space-y-3" >
                {/* <TagInput
                value={sourceLabels}
            /> */}
                <textarea
                    {...INPUT_PROPS.textInput}
                    className={_CSS.textInput}
                    data-input-textInput
                    value={state.textInput}
                    onChange={ev => _handleChange("textInput", ev.currentTarget.value)}
                />
                {/* <Textarea
                    {...INPUT_PROPS.textInput}
                    className={_CSS.textInput}
                    data-input-textInput
                    value={state.textInput}
                    onChange={v => _handleChange("textInput", v)}
                    placeholder={"press release\nmedia coverage\nanalytics dashboard"}
                /> */}

                <div className="flex items-center text-left gap-3" >
                    <div
                        className="px-2 py-1 bg-gray-50"
                    >
                        <label className="text-sm text-slate-700 mr-1" >
                            minScore:
                        </label>
                        <input
                            {...INPUT_PROPS.minScore}
                            data-input-minScore
                            className={_CSS.minScore}
                            value={state.minScore.toFixed(2)}
                            // type="number"
                            // step="0.01"
                            // min="0"
                            // max="1"
                            onChange={ev => _handleChange("minScore", ev.currentTarget.value)}
                        />
                        {/* <NumberInput
                            {...INPUT_PROPS.minScore}
                            className={_CSS.minScore}
                            value={state.minScore.toFixed(2)}
                            onChange={v => _handleChange("minScore", v ?? "")}
                        /> */}
                    </div>
                    <div>
                        <ControlButtons
                            isDisabled={buttonsAreDisabled}
                            onButtonClick={onButtonClick}
                        />
                    </div>
                    <div>
                        <ToggleGroup
                            data={pickFrom(state, "show_state_info_box")}
                            onChange={({ data }) => _set_state(data)}
                            size="xs"
                        />
                    </div>
                </div>
            </div>
            {state.show_state_info_box
                &&
                <ObjectView
                    data={infoData}
                    title="state-info"
                    showStringArraysAsTags
                    stringTags_withRandomColour
                />
            }
        </div>
    )
}