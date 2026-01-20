import { HasData } from "../../capabilities/index.js"


export type ApiResponse<
    D extends any = any
> = HasData<D>
