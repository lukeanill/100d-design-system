import type { ComponentProps } from "react"
import { Card as CardImpl, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card"
import { Button } from "@workspace/ui/components/button"

export default { title: "Components/Card", component: CardImpl }

export const Card = (args: ComponentProps<typeof CardImpl>) => (
  <CardImpl {...args} className="w-80">
    <CardHeader>
      <CardTitle>Card title</CardTitle>
      <CardDescription>A short card description.</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">Card body content goes here.</p>
    </CardContent>
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </CardImpl>
)
