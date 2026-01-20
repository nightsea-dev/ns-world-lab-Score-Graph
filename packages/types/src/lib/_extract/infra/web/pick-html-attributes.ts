import { HTMLAttributes } from "react";
import { KeyOf } from "../../../ts/index.js";



export type PickHtmlAttributes<
    Pk extends KeyOf<HTMLAttributes<T>>
    , T = HTMLElement
> = Pick<HTMLAttributes<T>, Pk>


export type OmitHtmlAttributes<
    Om extends KeyOf<HTMLAttributes<T>>
    , T = HTMLElement
> = Omit<HTMLAttributes<T>, Om>

export type PickAndOmitHtmlAttributes<
    PK extends KeyOf<HTMLAttributes<T>>
    , Om extends KeyOf<HTMLAttributes<T>>
    , T = HTMLElement
> =
    & Omit<PickHtmlAttributes<PK, T>, Om>



export type {
    PickHtmlAttributes as HasHtmlAttributes
    , OmitHtmlAttributes as HasHtmlAttributesOmitted
}
