import { isValidElement, ReactNode } from "react";
import { _memo, HasData } from "@ns-sg/types";


export type ErrorBoxProps =
    Partial<
        & HasData<ReactNode | Error>
    >


export const ErrorBox = ({
    data: data_IN
} = {} as ErrorBoxProps
) => {
    const { data }: Partial<HasData<ReactNode>> = _memo([data_IN], () => {
        if (!data_IN) {
            return {}
        }
        if (isValidElement(data_IN)) {
            return {
                data: data_IN
            }
        }
        if (data_IN instanceof Error) {
            const {
                name
                , message
                , stack
            } = data_IN
            return {
                data: (
                    <div>
                        <div>
                            {name}
                        </div>
                        <div>
                            {message}
                        </div>
                        <div>
                            {stack}
                        </div>
                    </div>
                )
            }
        }
        return {
            data: "Unknown [error]"
        }
    })
    return (
        data ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {data}
            </div>
        ) : null
    )
}
