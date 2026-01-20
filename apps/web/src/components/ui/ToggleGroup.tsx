import { _tw, _use_state, entriesOf, HasData, HasEventHandlersFromMap, HasHeader, HasIsDisabled, HasValue, KeyOf, PartialOrFull } from "@ns-sg/types"
import { CSSProperties, ReactNode } from "react"
import { Toggle, ToggleProps } from "rsuite"

type BoolMap = Record<string, boolean>

// ======================================== events
type _EV_MAP<
    M extends BoolMap
> = {
    change:
    & HasData<M>
    & {
        k: KeyOf<M>
    }
}



const STYLES = {
    table: {}
    , td: {
        padding: "2px 5px"
        , verticalAlign: "middle"
        , alignItems: "center"
        , position: "relative"
    }
    , tr: {}
    , thead: {}
    , tbody: {
        // backgroundColor: "dodgerblue"
    }
} as const satisfies Record<string, CSSProperties>

// ======================================== props
export type ToggleGroupProps<
    M extends BoolMap
> =
    & HasData<M>
    & Partial<
        & {
            noLabels: boolean
        }
        & HasIsDisabled
        & HasHeader<ReactNode>
        & Pick<ToggleProps, | "size" | "className">
        & HasEventHandlersFromMap<_EV_MAP<M>>
    >

// ======================================== component
export const ToggleGroup = <
    M extends BoolMap
>({
    data
    , header
    , size
    , noLabels = true
    , isDisabled
    , onChange
    , ...rest
}: ToggleGroupProps<M>
) => {
    const entries = entriesOf(data)
        , _handleChange =
            (...[k, v]: [k: KeyOf<M>, v: boolean]) => {
                onChange?.({
                    k
                    , data: {
                        ...data
                        , ...{ [k]: v }
                    }
                })
            }
    return (
        <table
            {...rest}
            data-toggle-group
            cellSpacing={0}
            cellPadding={0}
            style={STYLES.table}
        >
            {header && (
                <thead>
                    <tr><th
                        colSpan={2}
                        className=""
                        style={{
                            backgroundColor: "dodgerblue"
                            , color: "white"
                        }}
                    >
                        {header}
                    </th></tr>
                </thead>
            )}
            <tbody
                style={STYLES.tbody}
            >
                {entries.map(([k, v], i) => (
                    <tr
                        data-toggle-group-row
                        key={k}
                        title={`${k}: ${v}`}
                        style={STYLES.tr}
                    >
                        {noLabels
                            || <td
                                data-toggle-group-row-key
                                style={STYLES.td}
                            >
                                {k}
                            </td>}
                        <td
                            data-toggle-group-row-value
                            style={STYLES.td}
                        >
                            <Toggle
                                className="align-middle"
                                checked={v}
                                size={size}
                                onChange={v => _handleChange(k, v)}
                                disabled={isDisabled}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}


    , ToggleGroupWithState = <
        M extends BoolMap
    >({
        data
        , onChange
        , ...rest
    }: ToggleGroupProps<M>
    ) => {
        const [state, _set_state] = _use_state(data)
            , _handleChange: ToggleGroupProps<M>["onChange"] = (
                ev
            ) => {
                _set_state(ev.data)
                onChange?.(ev)
            }
        return (
            <ToggleGroup
                {...rest}
                data={state}
                onChange={_handleChange}
            />
        )
    }