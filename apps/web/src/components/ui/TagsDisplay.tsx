
import { Tag } from "rsuite"
import { HasPartialData, PickHtmlAttributes, PickRestPartial } from "@ns-sg/types"
import { normaliseStringsFn } from "../../utils"


export type TagsDisplayProps =
    & HasPartialData<string[]>
    & PickHtmlAttributes<"className">


export const TagsDisplay = ({
    data
    , ...rest
}: TagsDisplayProps
) => {

    if (!data?.length) {
        return null
    }

    data = normaliseStringsFn(data)

    return (
        <div
            {...rest}
            data-tags-display
            className={`flex flex-wrap gap-2 ${rest.className ?? ""}`}
        >
            {data.map((label, i) => (
                <Tag
                    key={[label, i].join("|")}
                    size="sm"
                >
                    {label}
                </Tag>
            ))}
        </div>
    )
}
