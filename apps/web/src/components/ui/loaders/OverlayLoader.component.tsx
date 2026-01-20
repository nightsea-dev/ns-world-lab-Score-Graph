import React, { ReactNode } from "react"
import { Loader, LoaderProps } from "rsuite"
import { HasShow, PickHtmlAttributes } from "@ns-sg/types"

// ======================================== props
type OverlayLoaderProps =
    Partial<
        & {
            blur?: boolean | number
        }
        & HasShow
        & Pick<LoaderProps, "backdrop">
        & PickHtmlAttributes<"children">
    >

// ======================================== component
export const OverlayLoader = ({
    show,
    backdrop = true,
    children = "Loading…"
    , blur
}: OverlayLoaderProps
) => {
    if (!show) {
        return null
    }

    const blurValue =
        blur === true
            ? 6
            : typeof blur === "number"
                ? blur
                : 0

    return (
        <div
            aria-busy="true"
            aria-live="polite"
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                display: "grid",
                placeItems: "center",
                pointerEvents: "auto",
                background: backdrop
                    ? "rgba(255,255,255,0.65)"
                    : "transparent",

                backdropFilter: blurValue
                    ? `blur(${blurValue}px)`
                    : undefined,

                WebkitBackdropFilter: blurValue
                    ? `blur(${blurValue}px)`
                    : undefined,
            }}
        >
            <Loader size="md" content={children} vertical />
        </div>
    )
}
