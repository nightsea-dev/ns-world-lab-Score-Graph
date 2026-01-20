

export const timestamp = (d = new Date) => [...d.toISOString().match(/\d+/img) ?? []].slice(3, 6).join(":")
    ,
    /**
     * * [timestamp]
     */
    _t = (carriageReturn = false) => `[${timestamp()}]` + (carriageReturn ? "\n" : "")
