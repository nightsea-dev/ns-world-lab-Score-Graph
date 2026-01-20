import { Loader, LoaderProps } from "rsuite"
import { HasChildren, HasContent, HasShow } from "@ns-sg/types"
import { ReactNode } from "react"

// ======================================== props
export type LoaderOverlayProps =
    Partial<
        & HasShow
        & HasChildren<ReactNode>
    >

// ======================================== component
export const LoaderOverlay = ({
    show
    , children = "Loading…"
}: LoaderOverlayProps
) => {

    if (!show) {
        return null
    }

    return (
        <Loader
            backdrop
            size="lg"
            content={children}
            vertical
        />
    )
}
