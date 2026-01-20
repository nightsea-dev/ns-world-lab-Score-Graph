
export type StateCommandKind = string
export type StateCommandStatus = Uppercase<string>
export type StateCommandStatusCommon = "IDLE" | "PENDING" | "RUNNING" | "SUCCESS" | "ERROR"

export type IdleStateCommand = { status: "IDLE" }

export type StateCommand<
    K extends StateCommandKind
    , S extends StateCommandStatus = StateCommandStatusCommon
> =
    {
        status: S
        command: K
        error?: string
    }

export type StateCommandWithIdle<
    K extends StateCommandKind
    , S extends StateCommandStatus = StateCommandStatusCommon
> =
    | IdleStateCommand
    | StateCommand<K, Exclude<S, "IDLE">>



export type HasStateCommand<
    C extends StateCommand<any, any>
> = {
    stateCommand: C | IdleStateCommand
}
export type HasStateCommandKind<
    C extends StateCommand<any, any>
> = {
    stateCommandKind: C["command"]
}