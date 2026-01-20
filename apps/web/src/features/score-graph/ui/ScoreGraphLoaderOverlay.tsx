
import { PickHtmlAttributes, PrefixKeys, PrefixedString } from "@ns-sg/types";
import { DotsAnim, ElapsedTimer, LoaderOverlay, LoaderOverlayProps, TagsDisplay } from "../../../components";
import { ScoreGraphAction } from "../../../state";



// ======================================== props
export type ScoreGraphLoaderOverlayProps =
    & Partial<
        & LoaderOverlayProps
        & PrefixKeys<"content_", PickHtmlAttributes<"style" | "className">>
        & {
            action: ScoreGraphAction
            sourceLabels: string[]
        }
    >

// ======================================== component
/**
 * @deprecated
 */
export const ScoreGraphLoaderOverlay = ({
    show
    , action
    , sourceLabels
    , content_className
    , content_style
    , ...rest
}: ScoreGraphLoaderOverlayProps
) => (
    <LoaderOverlay
        {...rest}
        show={show}
    >
        <div
            className={`text-left w-[75vw] ${content_className ?? ""}`}
            style={content_style}
        >
            {action &&
                <div>
                    <b>{action}</b>
                </div>
            }
            <div
                className="flex"
            >
                Please wait
                <ElapsedTimer />
                <DotsAnim
                    numberOfDots={10}
                    className="text-right"
                />
            </div>
            {action === "BUILDING [GraphPayload] from [textInput]"
                &&
                <TagsDisplay
                    data={sourceLabels}
                    className="mt-2"
                />
            }
        </div>
    </LoaderOverlay>
)