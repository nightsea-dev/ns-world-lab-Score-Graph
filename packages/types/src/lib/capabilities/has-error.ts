

export type HasError<
    E extends Error = Error
> = {
    error: E
}

export type HasPartialError<
    E extends Error = Error
> = Partial<HasError<E>>
