import { HasHeight, HasWidth } from "../../capabilities/index.js"

export type Size =
    & HasWidth
    & HasHeight



export type HasSize = {
    size: Size
}