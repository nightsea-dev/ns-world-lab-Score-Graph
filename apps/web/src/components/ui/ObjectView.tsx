import React, { CSSProperties, ReactNode, useRef } from "react"
import { _cb, _colours, _memo, entriesOf, HasData, HasDepth, PickHtmlAttributes, PrefixKeys, PrimitiveValue } from "@ns-sg/types"
import { Tag, TagGroup } from "rsuite"
import { NoData } from "./NoData"
import { CssPosition } from "../types"

// ========================================

// ========================================
const DEFAULT = {
    position: {
        top: 150
        , left: 50
    }
} as {
    position: CssPosition
}
// ========================================
const isStringArray = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every(v => (typeof v) === "string")

export type TagGroupNSProps =
    & HasData<string[]>
    & Partial<{
        withRandomColour: boolean
    }>

export const TagGroupNS = ({
    data
    , withRandomColour
    , ...rest
}: TagGroupNSProps
) => {
    const _c = _memo([withRandomColour], () => withRandomColour ? _colours.getRandomColourRgbString.bind(_colours) : undefined)
    return (
        <TagGroup
            {...rest}
        >
            {data.map((v, i) => (
                <Tag
                    key={[v, i].join("|")}
                    color={_c?.()}
                >{v}</Tag>
            ))}
        </TagGroup>
    )
}

// ========================================
export type ObjectViewValue =
    | object
    | {
        [k: string]: PrimitiveValue | ReactNode | ObjectViewValue
    }

// ========================================
export type ObjectViewProps<
    T extends ObjectViewValue
> =
    & Partial<
        & {
            data: T
            title: string
            sortedKeys: boolean
            fixedAt: CssPosition
            showStringArraysAsTags: boolean
        }
        & Pick<CSSProperties, "maxWidth" | "maxHeight">
        & PickHtmlAttributes<"className" | "style" | "onDoubleClick">

        & PrefixKeys<"stringTags_", Pick<TagGroupNSProps, "withRandomColour">>
    >

type ObjectViewPropsWithDepth<
    T extends ObjectViewValue
> =
    & Partial<
        & ObjectViewProps<T>
        & HasDepth
    >


type _getValueProps<
    T extends ObjectViewValue
> =
    & {
        v: unknown
    }
    & Pick<ObjectViewPropsWithDepth<T>, "depth" | "showStringArraysAsTags" | "stringTags_withRandomColour">

const _getValue = <
    T extends ObjectViewValue
>({
    v
    , depth = 0
    , showStringArraysAsTags
    , stringTags_withRandomColour
}: _getValueProps<T>
): ReactNode => {

    if (isStringArray(v) && showStringArraysAsTags) {
        return <TagGroupNS
            data={v}
            withRandomColour={stringTags_withRandomColour}
        />
    }

    return (v === undefined || v === null)
        ? "- - -"
        : React.isValidElement(v)
            ? v
            : typeof v === "object"
                ? <ObjectView
                    data={v}
                    {...{
                        depth: depth + 1
                        , showStringArraysAsTags
                        , stringTags_withRandomColour
                    }}
                />
                : String(v)


}
// ========================================
export const ObjectView = <
    T extends ObjectViewValue
>({
    data
    , title
    , fixedAt
    , maxWidth = "100vw"
    , maxHeight = "100vh"
    , sortedKeys
    , showStringArraysAsTags
    , stringTags_withRandomColour
    , ...rest
}: ObjectViewProps<T>
) => {

    if (!data) {
        return <NoData />
    }

    const {
        depth = 0
    } = rest as ObjectViewPropsWithDepth<T>

    if (!fixedAt && depth <= 0) {
        fixedAt = DEFAULT.position
    }

    const fixedAtStyle: React.CSSProperties | undefined
        = fixedAt
            ? {
                position: "fixed"
                , ...fixedAt
            }
            : undefined


    return (
        <table
            {...rest}
            data-object-view
            style={{
                ...rest.style
                , ...fixedAtStyle
                , maxWidth
                , maxHeight
                , zIndex: 100
            }}
            className={`
                    border
                    border-slate-200
                    rounded-md
                    overflow-hidden

                    bg-white
                    text-xs
                    text-slate-700
                    shadow-2xl
                    cursor-default

                    ${rest.className ?? ""}
      `}
        >
            {title && (
                <thead>
                    <tr>
                        <th
                            colSpan={2}
                            style={{
                                backgroundColor: "dodgerblue"
                                , color: "white"
                                , fontSize: 16
                            }}
                        >
                            {title}
                        </th>
                    </tr>
                </thead>
            )}

            <tbody>
                {entriesOf(data).map(([k, v], i) => (
                    <tr key={k}
                        className={`hover:bg-gray-100 transition-colors duration-[.1s]
                        ${i % 2 === 0 ? "bg-slate-50/50" : ""}                       `

                        }>
                        <td className="align-top border-t border-slate-200">
                            <div className="px-2 py-1 font-medium break-all text-slate-600">
                                {k}
                            </div>
                        </td>

                        <td className="align-top border-t border-slate-200">
                            <div className="px-2 py-1 break-all">
                                {_getValue({ v, depth, showStringArraysAsTags, stringTags_withRandomColour })}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
