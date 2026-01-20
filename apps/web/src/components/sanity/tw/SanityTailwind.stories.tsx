import type { Meta, StoryObj } from "@storybook/react"

function SanityTailwind() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                <h1 className="text-xl font-semibold text-emerald-400">Tailwind OK</h1>
                <p className="mt-2 text-sm text-slate-300">
                    Storybook is reading apps/web Tailwind styles.
                </p>
            </div>
        </div>
    )
}

const meta: Meta<typeof SanityTailwind> = {
    title: "Sanity/Tailwind",
    component: SanityTailwind,
}
export default meta

type Story = StoryObj<typeof SanityTailwind>
export const Default: Story = {}
