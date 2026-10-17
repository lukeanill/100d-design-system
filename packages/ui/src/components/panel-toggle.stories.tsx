import { useState } from "react"
import { Info } from "lucide-react"
import { PanelToggle as PanelToggleImpl } from "./panel-toggle"

export default {
  title: "Components/Actions/Panel Toggle",
  component: PanelToggleImpl,
  argTypes: {
    closeLabel: { control: "text" },
    metal: { control: "boolean" },
  },
  args: { closeLabel: "Close", metal: false },
}

export const PanelToggle = (args: { closeLabel: string; metal: boolean }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex justify-end p-10">
      <PanelToggleImpl {...args} open={open} onClick={() => setOpen((o) => !o)} icon={<Info />} label="About" />
    </div>
  )
}
