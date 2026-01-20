export function SanityTailwind() {
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-slate-900"
        >
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
                <h1 className="text-xl font-semibold text-emerald-400">
                    Tailwind OK
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                    Utilities are being generated and applied correctly.
                </p>

                <div className="mt-4 flex gap-2">
                    <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
                        bg-*
                    </span>
                    <span className="rounded bg-purple-600 px-2 py-1 text-xs text-white">
                        text-*
                    </span>
                    <span className="rounded bg-amber-600 px-2 py-1 text-xs text-black">
                        layout
                    </span>
                </div>
            </div>
        </div>
    )
}
