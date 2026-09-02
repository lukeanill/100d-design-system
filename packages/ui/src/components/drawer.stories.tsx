import { useState, type ComponentProps } from "react"
import {
  Drawer as DrawerImpl,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer"
import { Button } from "@workspace/ui/components/button"

const snapPoints = ["148px", "355px", 1]

export default {
  title: "Components/Overlays/Drawer",
  component: DrawerImpl,
  argTypes: {
    direction: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    enableSnapPoints: { control: "boolean" },
    dismissible: { control: "boolean" },
    modal: { control: "boolean" },
    shouldScaleBackground: { control: "boolean" },
    showHandle: { control: "boolean" },
  },
  args: {
    direction: "bottom",
    enableSnapPoints: false,
    dismissible: true,
    modal: true,
    shouldScaleBackground: true,
    showHandle: true,
  },
}

export const Drawer = ({
  direction,
  enableSnapPoints,
  dismissible,
  modal,
  shouldScaleBackground,
  showHandle,
  ...args
}: ComponentProps<typeof DrawerImpl> & {
  enableSnapPoints?: boolean
  showHandle?: boolean
}) => {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0] ?? null)

  return (
    <DrawerImpl
      direction={enableSnapPoints ? undefined : direction}
      dismissible={dismissible}
      modal={modal}
      shouldScaleBackground={shouldScaleBackground}
      snapPoints={enableSnapPoints ? snapPoints : undefined}
      activeSnapPoint={enableSnapPoints ? snap : undefined}
      setActiveSnapPoint={enableSnapPoints ? setSnap : undefined}
      {...args}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent showHandle={showHandle}>
        <DrawerHeader>
          <DrawerTitle>{enableSnapPoints ? "Drag me up" : "Edit profile"}</DrawerTitle>
          <DrawerDescription>
            {enableSnapPoints
              ? `Snaps to ${String(snap)}. Drag the handle to move between snap points.`
              : "Make changes to your profile here."}
          </DrawerDescription>
        </DrawerHeader>
        {enableSnapPoints ? (
          <div className="flex flex-col gap-3 overflow-y-auto px-6 pb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-muted bg-card p-4 text-sm shadow-xs"
              >
                Item {i + 1}
              </div>
            ))}
          </div>
        ) : (
          <DrawerFooter>
            <Button>Save</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </DrawerImpl>
  )
}
