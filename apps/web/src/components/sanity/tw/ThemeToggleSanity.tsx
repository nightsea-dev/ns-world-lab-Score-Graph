import { useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark" | "system"

function getSystemPrefersDark(): boolean {
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false
}

function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.classList.remove("dark")

    if (theme === "dark") root.classList.add("dark")
    if (theme === "system" && getSystemPrefersDark()) root.classList.add("dark")
}

export function ThemeToggleSanity() {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem("theme") as Theme | null
        return saved ?? "system"
    })

    const effectiveTheme = useMemo(() => {
        if (theme === "system") return getSystemPrefersDark() ? "dark" : "light"
        return theme
    }, [theme])

    useEffect(() => {
        applyTheme(theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    // Keep "system" mode reactive if OS theme changes
    useEffect(() => {
        if (theme !== "system") return
        const mql = window.matchMedia("(prefers-color-scheme: dark)")
        const handler = () => applyTheme("system")
        mql.addEventListener?.("change", handler)
        return () => mql.removeEventListener?.("change", handler)
    }, [theme])

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                            Theme toggle sanity
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Current: <span className="font-medium">{effectiveTheme}</span>{" "}
                            <span className="opacity-70">(mode: {theme})</span>
                        </p>
                    </div>

                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900">
                        <button
                            type="button"
                            onClick={() => setTheme("light")}
                            className={[
                                "px-3 py-1 text-sm rounded-md",
                                theme === "light"
                                    ? "bg-white shadow dark:bg-slate-800"
                                    : "text-slate-700 dark:text-slate-300",
                            ].join(" ")}
                        >
                            Light
                        </button>

                        <button
                            type="button"
                            onClick={() => setTheme("dark")}
                            className={[
                                "px-3 py-1 text-sm rounded-md",
                                theme === "dark"
                                    ? "bg-white shadow dark:bg-slate-800"
                                    : "text-slate-700 dark:text-slate-300",
                            ].join(" ")}
                        >
                            Dark
                        </button>

                        <button
                            type="button"
                            onClick={() => setTheme("system")}
                            className={[
                                "px-3 py-1 text-sm rounded-md",
                                theme === "system"
                                    ? "bg-white shadow dark:bg-slate-800"
                                    : "text-slate-700 dark:text-slate-300",
                            ].join(" ")}
                        >
                            System
                        </button>
                    </div>
                </div>

                <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                        This panel proves <code className="font-mono">dark:</code> variants
                        are working. Toggle themes above.
                    </p>
                </div>
            </div>
        </div>
    )
}
