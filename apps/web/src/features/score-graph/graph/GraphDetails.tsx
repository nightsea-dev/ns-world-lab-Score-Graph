import { GraphNode, GraphPayload, HasData, HasSelected, PickHtmlAttributes, _tw } from "@ns-sg/types";

const CSS = {
    el: _tw`
        inline-flex
        items-center
        whitespace-nowrap

        border-[1px]
        border-slate-200
        rounded-[5px]
        bg-gray-50

        m-0
        px-2
        py-1

        text-sm
        text-slate-700
        cursor-default
        shadow-[2px_2px_10px_0_rgba(0,0,0,0.1)]
        shadow-none

  `,
    td: _tw`
        inline-flex
        items-center
        gap-x-1
        px-2
  `,
    tdSep: _tw`
        border-l
        border-slate-200
  `,
    label: _tw`text-slate-600`,
    span: _tw`font-semibold text-slate-900`,
};

export type GraphDetailsProps =
    & Partial<
        & HasData<GraphPayload>
        & PickHtmlAttributes<"className">
        & HasSelected<GraphNode, "_GraphNode">
    >;

export const GraphDetails = ({
    data
    , data: {
        edges = []
        , nodes = []
    } = {} as GraphPayload
    , selected_GraphNode
    , ...rest
}: GraphDetailsProps) => {
    return (
        <div
            {...rest}
            data-graph-info
            className={`${CSS.el} ${rest.className ?? ""} 
            ${!nodes.length ? "opacity-20" : ""}
            `}
        >
            <div className={CSS.td}>
                <span className={CSS.label}>Nodes:</span>
                <span className={CSS.span}>{nodes.length ?? 0}</span>
            </div>
            <div className={`${CSS.td} ${CSS.tdSep}`}>
                <span className={CSS.label}>Edges:</span>
                <span className={CSS.span}>{edges.length ?? 0}</span>
            </div>
            <div className={`${CSS.td} ${CSS.tdSep}`}>
                <span className={CSS.label}>Selected</span>
                <span className={CSS.span}>{selected_GraphNode?.label ?? "---"}</span>
            </div>
        </div>
    );
};
