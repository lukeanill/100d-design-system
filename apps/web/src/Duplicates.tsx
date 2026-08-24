import { Link } from "react-router"
import { Button } from "@workspace/ui/components/button"

import { Accordion as CoreAccordion, AccordionItem as CoreAccordionItem, AccordionTrigger as CoreAccordionTrigger, AccordionContent as CoreAccordionContent } from "@workspace/ui/components/accordion"
import { Accordion as AnimAccordion, AccordionItem as AnimAccordionItem, AccordionTrigger as AnimAccordionTrigger, AccordionPanel as AnimAccordionPanel } from "@workspace/ui/components/animate-ui/components/base/accordion"

import { AlertDialog as CoreAlertDialog, AlertDialogTrigger as CoreAlertDialogTrigger, AlertDialogContent as CoreAlertDialogContent, AlertDialogHeader as CoreAlertDialogHeader, AlertDialogTitle as CoreAlertDialogTitle, AlertDialogDescription as CoreAlertDialogDescription, AlertDialogFooter as CoreAlertDialogFooter, AlertDialogCancel as CoreAlertDialogCancel, AlertDialogAction as CoreAlertDialogAction } from "@workspace/ui/components/alert-dialog"
import { AlertDialog as AnimAlertDialog, AlertDialogTrigger as AnimAlertDialogTrigger, AlertDialogPopup as AnimAlertDialogPopup, AlertDialogHeader as AnimAlertDialogHeader, AlertDialogTitle as AnimAlertDialogTitle, AlertDialogDescription as AnimAlertDialogDescription, AlertDialogFooter as AnimAlertDialogFooter, AlertDialogCancel as AnimAlertDialogCancel, AlertDialogAction as AnimAlertDialogAction } from "@workspace/ui/components/animate-ui/components/base/alert-dialog"

import { Button as CoreButton } from "@workspace/ui/components/button"
import { Button as AnimButton } from "@workspace/ui/components/animate-ui/components/buttons/button"

import { Checkbox as CoreCheckbox } from "@workspace/ui/components/checkbox"
import { Checkbox as AnimCheckbox } from "@workspace/ui/components/animate-ui/components/base/checkbox"

import { Dialog as CoreDialog, DialogTrigger as CoreDialogTrigger, DialogContent as CoreDialogContent, DialogHeader as CoreDialogHeader, DialogTitle as CoreDialogTitle, DialogDescription as CoreDialogDescription } from "@workspace/ui/components/dialog"
import { Dialog as AnimDialog, DialogTrigger as AnimDialogTrigger, DialogPopup as AnimDialogPopup, DialogHeader as AnimDialogHeader, DialogTitle as AnimDialogTitle, DialogDescription as AnimDialogDescription } from "@workspace/ui/components/animate-ui/components/base/dialog"

import { Popover as CorePopover, PopoverTrigger as CorePopoverTrigger, PopoverContent as CorePopoverContent } from "@workspace/ui/components/popover"
import { Popover as AnimPopover, PopoverTrigger as AnimPopoverTrigger, PopoverPanel as AnimPopoverPanel } from "@workspace/ui/components/animate-ui/components/base/popover"

import { Progress as CoreProgress } from "@workspace/ui/components/progress"
import { Progress as AnimProgress, ProgressTrack as AnimProgressTrack, ProgressLabel as AnimProgressLabel, ProgressValue as AnimProgressValue } from "@workspace/ui/components/animate-ui/components/base/progress"

import { Switch as CoreSwitch } from "@workspace/ui/components/switch"
import { Switch as AnimSwitch } from "@workspace/ui/components/animate-ui/components/base/switch"

import { Tabs as CoreTabs, TabsList as CoreTabsList, TabsTrigger as CoreTabsTrigger, TabsContent as CoreTabsContent } from "@workspace/ui/components/tabs"
import { Tabs as AnimTabs, TabsList as AnimTabsList, TabsTab as AnimTabsTab, TabsPanels as AnimTabsPanels, TabsPanel as AnimTabsPanel } from "@workspace/ui/components/animate-ui/components/base/tabs"

import { Toggle as CoreToggle } from "@workspace/ui/components/toggle"
import { Toggle as AnimToggle } from "@workspace/ui/components/animate-ui/components/base/toggle"

import { ToggleGroup as CoreToggleGroup, ToggleGroupItem as CoreToggleGroupItem } from "@workspace/ui/components/toggle-group"
import { ToggleGroup as AnimToggleGroup, Toggle as AnimToggleGroupItem } from "@workspace/ui/components/animate-ui/components/base/toggle-group"

import { Tooltip as CoreTooltip, TooltipTrigger as CoreTooltipTrigger, TooltipContent as CoreTooltipContent, TooltipProvider as CoreTooltipProvider } from "@workspace/ui/components/tooltip"
import { Tooltip as AnimTooltip, TooltipTrigger as AnimTooltipTrigger, TooltipPanel as AnimTooltipPanel } from "@workspace/ui/components/animate-ui/components/base/tooltip"

function Pair({
  name,
  core,
  animated,
}: {
  name: string
  path: string
  core: React.ReactNode
  animated: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[100px_1fr_1fr] items-center gap-4 border-b py-4">
      <div className="text-sm font-medium">{name}</div>
      <div className="flex min-h-10 items-center">{core}</div>
      <div className="flex min-h-10 items-center">{animated}</div>
    </div>
  )
}

export function Duplicates() {
  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Duplicate Components</h1>
          <p className="text-muted-foreground text-sm">
            Core components vs. their separate animate-ui &ldquo;Base&rdquo; implementations, for review.
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link to="/">Back to preview</Link>} />
      </div>

      <div className="grid grid-cols-[100px_1fr_1fr] gap-4 border-b pb-2 text-xs font-medium text-muted-foreground">
        <div />
        <div>Core</div>
        <div>Animated (animate-ui)</div>
      </div>

      <div className="flex flex-col">
        <Pair
          name="Accordion"
          path="accordion"
          core={
            <CoreAccordion className="w-full" defaultValue="item-1">
              <CoreAccordionItem value="item-1">
                <CoreAccordionTrigger>Is this animated?</CoreAccordionTrigger>
                <CoreAccordionContent>Yes, with a CSS grid-template-rows transition.</CoreAccordionContent>
              </CoreAccordionItem>
            </CoreAccordion>
          }
          animated={
            <AnimAccordion className="w-full">
              <AnimAccordionItem value="item-1">
                <AnimAccordionTrigger>Is this animated?</AnimAccordionTrigger>
                <AnimAccordionPanel>Yes, using Motion for animated height.</AnimAccordionPanel>
              </AnimAccordionItem>
            </AnimAccordion>
          }
        />

        <Pair
          name="Alert Dialog"
          path="alert-dialog"
          core={
            <CoreAlertDialog>
              <CoreAlertDialogTrigger render={<Button variant="outline">Open</Button>} />
              <CoreAlertDialogContent>
                <CoreAlertDialogHeader>
                  <CoreAlertDialogTitle>Delete project</CoreAlertDialogTitle>
                  <CoreAlertDialogDescription>This cannot be undone.</CoreAlertDialogDescription>
                </CoreAlertDialogHeader>
                <CoreAlertDialogFooter>
                  <CoreAlertDialogCancel>Cancel</CoreAlertDialogCancel>
                  <CoreAlertDialogAction>Delete</CoreAlertDialogAction>
                </CoreAlertDialogFooter>
              </CoreAlertDialogContent>
            </CoreAlertDialog>
          }
          animated={
            <AnimAlertDialog>
              <AnimAlertDialogTrigger render={<Button variant="outline">Open</Button>} />
              <AnimAlertDialogPopup>
                <AnimAlertDialogHeader>
                  <AnimAlertDialogTitle>Delete project</AnimAlertDialogTitle>
                  <AnimAlertDialogDescription>This cannot be undone.</AnimAlertDialogDescription>
                </AnimAlertDialogHeader>
                <AnimAlertDialogFooter>
                  <AnimAlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
                  <AnimAlertDialogAction render={<Button variant="destructive">Delete</Button>} />
                </AnimAlertDialogFooter>
              </AnimAlertDialogPopup>
            </AnimAlertDialog>
          }
        />

        <Pair
          name="Button"
          path="button(s)"
          core={
            <div className="flex flex-wrap gap-2">
              <CoreButton>Primary</CoreButton>
              <CoreButton variant="outline">Outline</CoreButton>
            </div>
          }
          animated={
            <div className="flex flex-wrap gap-2">
              <AnimButton>Primary</AnimButton>
              <AnimButton variant="outline">Outline</AnimButton>
            </div>
          }
        />

        <Pair
          name="Checkbox"
          path="checkbox"
          core={<CoreCheckbox defaultChecked />}
          animated={<AnimCheckbox defaultChecked />}
        />

        <Pair
          name="Dialog"
          path="dialog"
          core={
            <CoreDialog>
              <CoreDialogTrigger render={<Button variant="outline">Open</Button>} />
              <CoreDialogContent>
                <CoreDialogHeader>
                  <CoreDialogTitle>Edit profile</CoreDialogTitle>
                  <CoreDialogDescription>Make changes to your profile here.</CoreDialogDescription>
                </CoreDialogHeader>
              </CoreDialogContent>
            </CoreDialog>
          }
          animated={
            <AnimDialog>
              <AnimDialogTrigger render={<Button variant="outline">Open</Button>} />
              <AnimDialogPopup>
                <AnimDialogHeader>
                  <AnimDialogTitle>Edit profile</AnimDialogTitle>
                  <AnimDialogDescription>Make changes to your profile here.</AnimDialogDescription>
                </AnimDialogHeader>
              </AnimDialogPopup>
            </AnimDialog>
          }
        />

        <Pair
          name="Popover"
          path="popover"
          core={
            <CorePopover>
              <CorePopoverTrigger render={<Button variant="outline">Open</Button>} />
              <CorePopoverContent className="text-sm">Set your preferences here.</CorePopoverContent>
            </CorePopover>
          }
          animated={
            <AnimPopover>
              <AnimPopoverTrigger render={<Button variant="outline">Open</Button>} />
              <AnimPopoverPanel className="text-sm">Set your preferences here.</AnimPopoverPanel>
            </AnimPopover>
          }
        />

        <Pair
          name="Progress"
          path="progress"
          core={<CoreProgress value={68} className="w-full" />}
          animated={
            <AnimProgress value={68} className="w-full">
              <AnimProgressLabel>Storage</AnimProgressLabel>
              <AnimProgressTrack />
              <AnimProgressValue />
            </AnimProgress>
          }
        />

        <Pair
          name="Switch"
          path="switch"
          core={<CoreSwitch defaultChecked />}
          animated={<AnimSwitch defaultChecked />}
        />

        <Pair
          name="Tabs"
          path="tabs"
          core={
            <CoreTabs defaultValue="a" className="w-full">
              <CoreTabsList>
                <CoreTabsTrigger value="a">Files</CoreTabsTrigger>
                <CoreTabsTrigger value="b">Shared</CoreTabsTrigger>
              </CoreTabsList>
              <CoreTabsContent value="a" className="text-muted-foreground text-sm">
                124 files.
              </CoreTabsContent>
            </CoreTabs>
          }
          animated={
            <AnimTabs defaultValue="a" className="w-full">
              <AnimTabsList>
                <AnimTabsTab value="a">Files</AnimTabsTab>
                <AnimTabsTab value="b">Shared</AnimTabsTab>
              </AnimTabsList>
              <AnimTabsPanels>
                <AnimTabsPanel value="a" className="text-muted-foreground text-sm">
                  124 files.
                </AnimTabsPanel>
              </AnimTabsPanels>
            </AnimTabs>
          }
        />

        <Pair
          name="Toggle"
          path="toggle"
          core={<CoreToggle defaultPressed>Bold</CoreToggle>}
          animated={<AnimToggle defaultPressed>Bold</AnimToggle>}
        />

        <Pair
          name="Toggle Group"
          path="toggle-group"
          core={
            <CoreToggleGroup type="single" defaultValue="left">
              <CoreToggleGroupItem value="left">Left</CoreToggleGroupItem>
              <CoreToggleGroupItem value="center">Center</CoreToggleGroupItem>
            </CoreToggleGroup>
          }
          animated={
            <AnimToggleGroup defaultValue={["left"]}>
              <AnimToggleGroupItem value="left">Left</AnimToggleGroupItem>
              <AnimToggleGroupItem value="center">Center</AnimToggleGroupItem>
            </AnimToggleGroup>
          }
        />

        <Pair
          name="Tooltip"
          path="tooltip"
          core={
            <CoreTooltipProvider>
              <CoreTooltip>
                <CoreTooltipTrigger render={<Button variant="outline">Hover me</Button>} />
                <CoreTooltipContent>Tooltip content</CoreTooltipContent>
              </CoreTooltip>
            </CoreTooltipProvider>
          }
          animated={
            <AnimTooltip>
              <AnimTooltipTrigger render={<Button variant="outline">Hover me</Button>} />
              <AnimTooltipPanel>Tooltip content</AnimTooltipPanel>
            </AnimTooltip>
          }
        />
      </div>
    </div>
  )
}
