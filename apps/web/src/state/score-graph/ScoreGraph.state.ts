import { GraphNodeWithDetails, GraphPayload, HasError, HasScore, HasSelected, HasStateCommand, StateCommand, StateCommandKind, UnionToIntersection, IdleStateCommand, HasStateCommandKind, HasAction, createUndefinedFor, ID } from "@ns-sg/types"
import { GraphCaseCategory, GraphCaseData } from "../../data"

// ========================================
/**
 * @deprecated
 */
export type ScoreGraphAction =
    | "LOAD [GraphPayload] from [DB]"
    | "LOADIND [GraphPayload] from [DB]"

    | "BUILD [GraphPayload] from [textInput]"
    | "BUILDING [GraphPayload] from [textInput]"

    | "LOAD [GraphNodeDetail] from [DB]"
    | "LOADIND [GraphNodeDetail] from [DB]"

    | "IDLE"


export type ScoreGraphStateStateStatusBase = "REQUESTED" | "PROCESSING"


export type ScoreGraphStateCommand =
    | StateCommand<"LOAD [GraphPayload] from [DB]", ScoreGraphStateStateStatusBase | "LOADING">
    | StateCommand<"BUILD [GraphPayload] from [textInput]", ScoreGraphStateStateStatusBase | "BUILDING">
    | StateCommand<"LOAD [GraphNodeDetail] from [DB]", ScoreGraphStateStateStatusBase | "LOADING">

// export type ScoreGraphStateCommand =
//     | ScoreGraphStateCommandBase
//     | IdleStateCommand

export type ScoreGraphStateCommandKind = ScoreGraphStateCommand["command"]

// ========================================
export type HasScoreGraphStateCommand = HasStateCommand<ScoreGraphStateCommand>
export type HasScoreGraphStateCommandKind = HasStateCommandKind<ScoreGraphStateCommand>


// ======================================== state
// ScoreGraphCommand
// ScoreGraphCommandState
export type ScoreGraphState =
    & Partial<
        & {
            minScore: number
            /**
             * * we compute from these [textInput]
             * * dewpendant on: props.inputText
             */
            textInput: string
            /**
             * * can only be created/assigned after a DB call that 
             */
            // sourceLabels: string[]


            isFirstRender: boolean


            // showOverlay: | "SHOWN" | "HIDDEN" | "REQUESTED"
            lapsed_ms: number
            previous_selected_NodeId: ID


            computedGraphPayload: GraphPayload


        }

        //& HasAction<ScoreGraphAction>
        & HasScoreGraphStateCommand

        & HasError
        & HasScore


        & HasSelected<GraphNodeWithDetails, "_NodeWithDetails">
        & HasSelected<GraphCaseData, "_GraphCaseData">
        & HasSelected<GraphCaseCategory, "_GraphCaseCategory">
        & HasSelected<string, "_NodeId">

    >






// ======================================== helpers
export const CLEAR_STATE_COMMAND = Object.freeze({
    stateCommand: {
        status: "IDLE"
    }
} as HasScoreGraphStateCommand
)


    , CLEAR_GRAPH_SELECTED =
        createUndefinedFor<ScoreGraphState>()(
            "error"
            , "selected_NodeId"
            , "selected_NodeWithDetails"
            , "selected_GraphCaseData"
            , "selected_GraphCaseCategory"
        )


    , CLEAR_GRAPH_PAYLOAD_AND_INPUT_TEXT =
        createUndefinedFor<ScoreGraphState>()(
            "computedGraphPayload"
            , "textInput"
        )



    , requestCommand = <
        C extends ScoreGraphStateCommandKind
    >(
        command: C
    ): ScoreGraphStateCommand => ({
        command
        , status: "REQUESTED"
    })

