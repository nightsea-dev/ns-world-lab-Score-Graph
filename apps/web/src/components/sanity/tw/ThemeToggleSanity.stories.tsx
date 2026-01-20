import type { Meta, StoryObj } from "@storybook/react"
import { ThemeToggleSanity } from "./ThemeToggleSanity"

const meta: Meta<typeof ThemeToggleSanity> = {
    title: "Sanity/ThemeToggle",
    component: ThemeToggleSanity,
}
export default meta

type Story = StoryObj<typeof ThemeToggleSanity>
export const Default: Story = {}
