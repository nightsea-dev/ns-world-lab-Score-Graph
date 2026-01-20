export type PgTimestampWithTimeZone
    = string
    & { readonly __brand: "PgTimestampWithTimeZone" }

export type HasAuditTimestamps = {
    created_at: PgTimestampWithTimeZone
    updated_at?: PgTimestampWithTimeZone
}

export type HasPartialAuditTimestamps<
    K extends keyof HasAuditTimestamps
> = Pick<HasAuditTimestamps, K>




export type HasTimestamp = {
    timestamp: PgTimestampWithTimeZone
}