
import React, { ReactNode } from "react"
import { clampToUnitInterval, HasChildren, HasContent, HasShow, HasTitle, PickHtmlAttributes } from "@ns-sg/types"
import { Loader, LoaderProps } from "rsuite"



// ======================================== helpers
const toPercentage = (progress?: number) => {
    if (progress === undefined || Number.isNaN(progress)) {
        return undefined
    }
    const p = progress > 1 ? progress / 100 : progress
    return Math.round(clampToUnitInterval(p) * 100)
}




// ======================================== component
export type LoaderDivProps =
    Partial<
        & HasTitle<ReactNode>
        & HasChildren<React.ReactNode>
        & {
            subject?: ReactNode
            progress?: number // 0..1 or 0..100 accepted
            // size?: "xs" | "sm" | "md" | "lg"
        }
        & PickHtmlAttributes<"className">
        & Pick<LoaderProps, "size">
        & HasShow
    >


// ======================================== component
export const LoaderDiv = ({
    title = "Loading",
    subject,
    children,
    progress,
    size = "sm",
    className,
    show
    , ...rest
}: LoaderDivProps
) => {
    const pct = toPercentage(progress)

    return show && (
        <div
            {...rest}
            data-loader-div
            className={`
        w-full
        rounded-lg
        border border-slate-200
        bg-white
        p-4
        ${className ?? ""}
      `}
        >
            <div className="flex items-start justify-between gap-x-4">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    {subject ? (
                        <div className="mt-1 text-xs text-slate-600">{subject}</div>
                    ) : null}
                </div>

                <div className="shrink-0">
                    <Loader size={size} />
                </div>
            </div>

            {children ? (
                <div className="mt-3 text-sm text-slate-700">
                    {children}
                </div>
            ) : null}

            {pct !== undefined ? (
                <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Progress</span>
                        <span className="tabular-nums">{pct}%</span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-blue-500 transition-[width] duration-300"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    )
}
