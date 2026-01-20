import {
    EventWKindMapInfo,
    HasSelected,
    KeyOf
} from "@ns-sg/types"
import { GraphCaseButton } from "./GraphCase.button"
import { getGraphCaseData, GraphCase_KEYS, GraphCaseCategory, GraphCaseData } from "../../../data"
import { Panel } from "rsuite"

// ======================================== events
type _EV_INFO =
    EventWKindMapInfo<{
        select: HasSelected<GraphCaseData, "_GraphCaseData">
        click: {}
    }>





export type GraphCaseCollectionEventOf<
    K extends _EV_INFO["EventKind"] = _EV_INFO["EventKind"]
> = _EV_INFO["Events"][K]

export type GraphCaseCollectionEventHandlerOf<
    K extends _EV_INFO["EventKind"] = _EV_INFO["EventKind"]
> = _EV_INFO["HandlersByEventKind"][K]




// ======================================== props
export type GraphCaseCollectionProps =
    & Partial<
        & _EV_INFO["Handlers"]
        & HasSelected<GraphCaseCategory, "_CaseCategory">
    >



// ======================================== component
export const GraphCaseCollection = ({
    selected_CaseCategory
    , onSelect
} = {} as GraphCaseCollectionProps
) => {

    const keys = GraphCase_KEYS
        , _handleGraphCaseButtonClick = (
            category: GraphCaseCategory
        ) => {
            // debugger
            onSelect?.({
                selected_GraphCaseData: getGraphCaseData(category)
                , __eventKind: "select"
            })
        }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3"
        >
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Topic Cases</div>
                <div className="text-xs text-slate-500">{keys.length} sets</div>
            </div>
            <div className="mt-2 grid gap-2">
                {keys.map(category => {

                    const isActive = selected_CaseCategory === category
                        , dataItem = getGraphCaseData(category)

                    return (
                        <GraphCaseButton
                            key={category}
                            data={dataItem}
                            isActive={isActive}
                            onClick={() => _handleGraphCaseButtonClick(category)}
                        />
                    );
                })}
            </div>

            <div className="mt-3 text-xs text-slate-500">
                Selecting a [set] replaces the [topic input] to quickly [generate] non-zero Jaccard scores.
            </div>
        </div>
    )
}
