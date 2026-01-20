import React, { ReactNode } from "react";
import { Loader, Panel, Progress } from "rsuite";
import { HasChildren, HasContent, HasShow, HasTitle, PickHtmlAttributes } from "@ns-sg/types";

// ======================================== props
type LoaderPanelProps =
    & Partial<
        & {
            message: string;
            /**
             * Optional progress in [0..1]
             */
            progress: number;
            /**
             * Dim underlying content while loading
             */
            dim: boolean;
            /**
             * Prevent layout jump
             */
            minHeight: number | string;
        }
        & HasTitle
        & HasShow
        // & HasChildren<ReactNode>
        & PickHtmlAttributes<"children" | "className">
    >

// ======================================== component
export const LoaderPanel = ({
    show,
    title,
    message = "Please wait…",
    progress,
    dim = true,
    minHeight = 220,
    children
    , ...rest
}: LoaderPanelProps
) => {
    const percent =
        typeof progress === "number"
            ? Math.max(0, Math.min(1, progress)) * 100
            : undefined;

    return (
        <Panel
            {...rest}
            bordered
            style={{
                position: "relative",
                minHeight,
                overflow: "hidden",
            }}
        >
            {(title || message) && (
                <div style={{ marginBottom: 12 }}>
                    {title && <div style={{ fontWeight: 600 }}>{title}</div>}
                    {message && (
                        <div style={{ opacity: 0.75, marginTop: title ? 4 : 0 }}>
                            {message}
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div style={{ opacity: show && dim ? 0.35 : 1 }}>
                {children}
            </div>

            {/* Overlay */}
            {show && (
                <div
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        padding: 16,
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            width: "min(360px, 92%)",
                            display: "grid",
                            gap: 12,
                            textAlign: "center",
                        }}
                    >
                        <Loader
                            size="md"
                            content={title ?? "Loading"}
                        />

                        {typeof percent === "number" && (
                            <Progress.Line
                                percent={percent}
                                strokeWidth={6}
                                showInfo
                            />
                        )}
                    </div>
                </div>
            )}
        </Panel>
    );
};
