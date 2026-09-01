import { Toaster, toast } from "./toast"
import { Button } from "@workspace/ui/components/button"

export default {
  title: "Components/Feedback/Toast",
  component: Toaster,
  argTypes: {
    type: {
      control: "select",
      options: ["success", "info", "warning", "error", "loading"],
    },
    title: { control: "text" },
    description: { control: "text" },
  },
  args: {
    title: "Update available",
    description: "A new version of the app is ready to install.",
    type: "success",
  },
}

export const Toast = (args: { title: string; description: string; type: string }) => (
  <Toaster>
    <Button
      variant="outline"
      onClick={() =>
        toast.add({
          title: args.title,
          description: args.description,
          type: args.type,
        })
      }
    >
      Show toast
    </Button>
  </Toaster>
)
