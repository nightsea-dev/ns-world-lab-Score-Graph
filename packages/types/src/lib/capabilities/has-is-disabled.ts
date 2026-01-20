


export type HasIsDisabled<
    Px extends string = ""
> = {
        [k in `${Px}isDisabled`]: boolean
    }



export type HasDisabled = {
    disabled: boolean
}
export type HasPartialDisabled =
    Partial<HasDisabled>
