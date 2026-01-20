import { Panel as RSPanel, PanelProps as RSPanelProps } from "rsuite"

export type PanelProps =
    Partial<
        & {
            minHeight: number// = 220
        }
        & RSPanelProps
    >

export const Panel = ({
    minHeight
    , ...rest
}: PanelProps
) => {
    return (
        <RSPanel
            {...rest}
            bordered
            style={{
                position: "relative"
                , minHeight
                , overflow: "hidden"
                , ...rest.style
            }}
        />
    )
}