

export type DotsAnimProps =
    & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
    & {
        numberOfDots?: number
        intervalSeconds?: number
    }

import "./DotsAnim.css"

export const DotsAnim = (
    {
        numberOfDots = 3
        , intervalSeconds = 1
        , ...rest
    }: DotsAnimProps
) => {

    return (
        <span
            {...rest}
            style={{
                ...(rest.style ?? {})
                , ["--dots-count" as any]: numberOfDots
                , ["--dots-duration" as any]: `${intervalSeconds}s`
            }}
            className={`dots-anim ${rest.className ?? ""}`}
        />
    )
}
