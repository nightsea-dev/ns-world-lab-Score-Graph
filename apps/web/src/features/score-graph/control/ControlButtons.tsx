import {
    HasIsDisabled
    , _memo
    , EventWKindMapInfo
} from "@ns-sg/types"
import { Button, ButtonGroup, ButtonProps } from "rsuite"
import { ReactNode } from "react"


// ========================================
const DEFAULT_Labels = {
    build: "Build Graph"
    , load: "Load from DB"
    , clear: "Clear"
} as const satisfies Record<ButtonKind, string>


// ========================================
export const BUTTON_KINDS = ["build", "load", "clear"] as const
type ButtonKind = (typeof BUTTON_KINDS)[number]

// ========================================
type _EV_INFO =
    EventWKindMapInfo<
        & {
            buttonClick: {
                buttonKind: ButtonKind
            }
        }
    >

export {
    type _EV_INFO as ControlButtonsGroupEventInfo
}

export type ControlButtonsGroupEventOf<
    K extends _EV_INFO["EventKind"] = _EV_INFO["EventKind"]
> = _EV_INFO["Events"][K]


// ========================================
export type ButtonsCollectionProps =
    & Partial<
        & _EV_INFO["Handlers"]
        & HasIsDisabled
        & {
            labels: Record<ButtonKind, ReactNode>
        }
        & Pick<ButtonProps, "size">
    >

// ======================================== component
export const ControlButtons = (
    {
        isDisabled
        , labels
        , size = "sm"
        , onButtonClick
    } = {} as ButtonsCollectionProps
) => {
    return (
        <div
            data-control-buttons-group
            className="flex shrink-0 gap-2 w-max"
        >
            <ButtonGroup
                disabled={isDisabled}
            >
                {BUTTON_KINDS
                    .map(buttonKind => (
                        <Button
                            key={buttonKind}
                            type="button"
                            onClick={() => onButtonClick?.({
                                __eventKind: "buttonClick"
                                , buttonKind
                            })}
                            appearance={buttonKind === "build" ? "primary" : undefined}
                            size={size}
                        >
                            {labels?.[buttonKind] ?? DEFAULT_Labels[buttonKind]}
                        </Button>))}
            </ButtonGroup>
        </div>
    )
}




