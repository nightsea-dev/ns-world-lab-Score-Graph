import {
    EventWKindMapInfo,
    HasCategory, HasData,
} from "@ns-sg/types"
import { GraphCaseCategory, GraphCaseData } from "../../../data"


type _EV_INFO<
    K extends GraphCaseCategory = GraphCaseCategory
> = EventWKindMapInfo<{
    "click": HasData<GraphCaseData<K>>
}>


// ========================================
export type GraphCaseButtonProps<
    K extends GraphCaseCategory = GraphCaseCategory
> =
    & HasData<GraphCaseData<K>>
    & Partial<
        & _EV_INFO<K>["Handlers"]
        & {
            isActive: boolean
        }
    >
// ========================================
export const GraphCaseButton = <
    K extends GraphCaseCategory = GraphCaseCategory
>({
    data
    , isActive
    , onClick
}: GraphCaseButtonProps<K>
) => {
    const {
        category
        , items
    } = data
    return (
        <button
            type="button"
            onClick={() => onClick?.({
                data
                , __eventKind: "click"
            })}
            className={[
                "w-full rounded-md border px-3 py-2 text-left text-sm transition",
                isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
            ].join(" ")}
        >
            <div className="flex items-center justify-between">
                <span className="capitalize">{category}</span>
                <span className={isActive ? "text-white/80 text-xs" : "text-slate-500 text-xs"}>
                    {items.length} topic{([...items].length === 1) ? "" : "s"}
                </span>
            </div>
        </button>
    )
}
