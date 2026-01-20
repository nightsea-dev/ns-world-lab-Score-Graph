// apps/web/src/state/score-graph/ScoreGraph.store.zustand.ts
import { create } from "zustand"
import { API } from "../../api"
import { normaliseStringsFn } from "../../utils"
import {
    ScoreGraphState,
    ScoreGraphStateCommandKind,
    requestCommand,
    ScoreGraphStateCommand,
    CLEAR_GRAPH_SELECTED,
    CLEAR_GRAPH_PAYLOAD_AND_INPUT_TEXT,
    CLEAR_STATE_COMMAND
} from "./ScoreGraph.state"


type Store = ScoreGraphState & {
    setTextInput: (textInput: string) => void
    setMinScore: (minScore: number) => void

    request: <C extends ScoreGraphStateCommandKind>(command: C) => Promise<void>
    clear: () => void

    selectNodeId: (id?: string) => void
    selectCaseData: (selected_GraphCaseData?: ScoreGraphState["selected_GraphCaseData"]) => Promise<void>

    // internal executor
    _runCommand: (cmd: ScoreGraphStateCommand) => Promise<void>
    _validateResponse: (response: any) => boolean
}

export const useScoreGraphStore = create<Store>((set, get) => ({
    // ---- initial state
    minScore: 0.5, // you can hydrate from ENV in the view or pass init action
    isFirstRender: true,
    showOverlay: false,
    lapsed_ms: 0,

    textInput: "",
    computedGraphPayload: undefined,

    selected_NodeId: undefined,
    previous_selected_NodeId: undefined,
    selected_NodeWithDetails: undefined,

    selected_GraphCaseData: undefined,
    selected_GraphCaseCategory: undefined,

    error: undefined,
    score: undefined,

    // stateCommand is always present but can be IDLE
    stateCommand: { status: "IDLE" },

    // ---- basic setters
    setTextInput: (textInput) => set({ textInput }),
    setMinScore: (minScore) => set({ minScore }),

    clear: () =>
        set({
            ...CLEAR_GRAPH_SELECTED,
            ...CLEAR_GRAPH_PAYLOAD_AND_INPUT_TEXT,
            ...CLEAR_STATE_COMMAND,
            // showOverlay: false,
            lapsed_ms: 0,
            error: undefined,
        }),

    selectNodeId: (id) =>
        set((s) => ({
            selected_NodeId: id,
        })),

    // Case selection: update textInput then request build
    selectCaseData: async (selected_GraphCaseData) => {
        set({ selected_GraphCaseData })

        const items = selected_GraphCaseData?.items ?? []
        const labels = normaliseStringsFn(items)
        if (!labels.length) return

        set({ textInput: labels.join(", ") })
        await get().request("BUILD [GraphPayload] from [textInput]")
    },

    // ---- command interface
    request: async (command) => {
        const cmd = requestCommand(command)
        set({ stateCommand: cmd })
        await get()._runCommand(cmd)
    },

    _validateResponse: (response) => {
        if (!response) {
            set({ error: new Error("Got no [response]. Something's WRONG") })
            set({ ...CLEAR_STATE_COMMAND })
            return false
        }
        return true
    },

    _runCommand: async (stateCommand) => {
        // guard: only run REQUESTED commands
        if (stateCommand.status !== "REQUESTED") return

        const started = Date.now()
        const { command } = stateCommand

        // mark processing (your "PROCESSING" phase)
        set({
            stateCommand: { ...stateCommand, status: "PROCESSING" },
        })

        try {
            switch (command) {
                case "LOAD [GraphPayload] from [DB]": {
                    set({
                        ...CLEAR_GRAPH_SELECTED,
                        computedGraphPayload: undefined,
                        stateCommand: { ...stateCommand, status: "LOADING" },
                    })

                    const response = await API.graph.load_GraphPayload_fromDB()
                    if (!get()._validateResponse(response)) return

                    set({ computedGraphPayload: response.data })
                    return
                }

                case "BUILD [GraphPayload] from [textInput]": {
                    const { textInput, minScore } = get()
                    const sourceLabels = normaliseStringsFn(textInput)

                    if (!sourceLabels.length) {
                        set({ error: new Error("[textInput.length: 0] no [labels] to build the [graph] from.") })
                        return
                    }

                    set({
                        stateCommand: { ...stateCommand, status: "BUILDING" },
                    })

                    const response = await API.graph.build_GraphPayload_fromSourceLabels({
                        sourceLabels,
                        minScore,
                    })
                    if (!get()._validateResponse(response)) return

                    set({
                        computedGraphPayload: response.data,
                        error: response.error,
                    })

                    return
                }

                case "LOAD [GraphNodeDetail] from [DB]": {
                    const { selected_NodeId, previous_selected_NodeId } = get()
                    if (!selected_NodeId || selected_NodeId === previous_selected_NodeId) return

                    set({
                        ...CLEAR_GRAPH_SELECTED,
                        selected_NodeWithDetails: undefined,
                        stateCommand: { ...stateCommand, status: "LOADING" },
                    })

                    const response = await API.topic.get_GraphNodeDetails({ id: selected_NodeId })
                    if (!get()._validateResponse(response)) return

                    const selected_NodeWithDetails = response.data
                    const id = response.data?.node?.id

                    set({
                        selected_NodeWithDetails,
                        selected_NodeId: id,
                        previous_selected_NodeId: id,
                    })

                    return
                }
            }
        } finally {
            const lapsed_ms = Date.now() - started
            set({
                ...CLEAR_STATE_COMMAND,
                lapsed_ms,
                // showOverlay: false,
            })
        }
    },
}))
