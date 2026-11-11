"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon, CopyIcon } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { SurfaceFill } from "@workspace/ui/components/themed-surface"
import { ThemedIcon } from "@workspace/ui/components/themed-icon"

/**
 * Syntax colours come from the theme: the highlighter writes `--shiki-*` properties and they are
 * pointed at the design system's tokens here. Keywords, strings, functions, constants and
 * parameters take --chart-1 to --chart-5 (the theme's ui-color mode); comments and punctuation are
 * --muted-foreground; everything else is --foreground.
 */
const codeBlockVariants = cva(
  "group/code-block relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-lg text-md ring-1 has-[>[data-slot=code-block-content]:focus-visible]:ring-[3px] [--shiki-foreground:var(--foreground)] [--shiki-background:transparent] [--shiki-token-keyword:var(--chart-1)] [--shiki-token-string:var(--chart-2)] [--shiki-token-string-expression:var(--chart-2)] [--shiki-token-function:var(--chart-3)] [--shiki-token-constant:var(--chart-4)] [--shiki-token-parameter:var(--chart-5)] [--shiki-token-link:var(--chart-1)] [--shiki-token-comment:var(--muted-foreground)] [--shiki-token-punctuation:var(--muted-foreground)] data-[size=sm]:rounded-md data-[size=sm]:text-sm",
  {
    variants: {
      variant: {
        default: "text-card-foreground ring-foreground/10 has-[>[data-slot=code-block-content]:focus-visible]:ring-ring/50",
        destructive: "text-destructive ring-destructive/30 has-[>[data-slot=code-block-content]:focus-visible]:ring-destructive/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function CodeBlock({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof codeBlockVariants> & { size?: "default" | "sm" }) {
  return (
    <div data-slot="code-block" data-variant={variant} data-size={size} className={cn(codeBlockVariants({ variant }), className)} {...props}>
      <SurfaceFill popup weight="heavy" />
      {children}
    </div>
  )
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "flex min-w-0 shrink-0 items-center gap-2 px-4 pt-4 text-muted-foreground group-data-[size=sm]/code-block:px-2 group-data-[size=sm]/code-block:pt-2 group-data-[variant=destructive]/code-block:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "min-w-0 truncate text-label-md text-foreground group-data-[variant=destructive]/code-block:text-destructive [&_svg]:pointer-events-none [&_svg]:inline-block [&_svg]:align-middle [&_svg:not([class*='size-'])]:size-4 *:[svg]:me-2",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn(
        "ms-auto flex shrink-0 items-center gap-1 [[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:end-3 [[data-slot=code-block]>&]:top-3 [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity [[data-slot=code-block]>&]:duration-(--motion-fast) [[data-slot=code-block]>&]:ease-(--motion-transition-ease) [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100 group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:end-2 group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:top-2 [[data-slot=code-block]>&]:pointer-coarse:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockCopyButton({
  value,
  variant = "ghost",
  size = "icon-xs",
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { value: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <>
      <Button
        data-slot="code-block-copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size}
        aria-label={copied ? "Copied" : "Copy"}
        className={className}
        onClick={(event) => {
          onClick?.(event)
          navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .catch(() => {})
        }}
        {...props}
      >
        <ThemedIcon phosphor={copied ? CheckIcon : CopyIcon} className="size-3" />
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </>
  )
}

function CodeBlockContent({
  className,
  children,
  style,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  ...props
}: React.ComponentProps<"pre"> & { wrap?: boolean; lineNumbers?: boolean; startLine?: number }) {
  return (
    <pre
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      data-numbered={lineNumbers || undefined}
      dir="ltr"
      tabIndex={0}
      style={{ counterReset: `line ${startLine - 1}`, ...style }}
      className={cn(
        "min-h-0 min-w-0 overflow-auto px-4 py-4 text-start font-mono leading-relaxed outline-none group-has-data-[slot=code-block-footer]/code-block:pb-2 group-has-data-[slot=code-block-header]/code-block:pt-2 group-data-[size=sm]/code-block:px-2 group-data-[size=sm]/code-block:py-2 data-wrap:break-words data-wrap:whitespace-pre-wrap",
        className
      )}
      {...props}
    >
      <code data-slot="code-block-code" className="grid min-h-lh min-w-max content-start in-data-numbered:grid-cols-[auto_1fr] in-data-wrap:min-w-0">
        {lineNumbers && typeof children === "string"
          ? children
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => <CodeBlockLine key={index}>{line}</CodeBlockLine>)
          : children}
      </code>
    </pre>
  )
}

const codeBlockLineVariants = cva(
  "relative -mx-4 block min-h-lh px-4 group-data-[size=sm]/code-block:-mx-2 group-data-[size=sm]/code-block:px-2 before:min-w-6 before:text-end before:text-muted-foreground after:absolute after:start-1 after:top-0 after:text-muted-foreground after:select-none in-data-numbered:col-span-2 in-data-numbered:grid in-data-numbered:grid-cols-subgrid in-data-numbered:gap-x-4 in-data-numbered:[counter-increment:line] in-data-numbered:before:content-[counter(line)] in-data-numbered:before:select-none",
  {
    variants: {
      variant: {
        default: "",
        added: "bg-muted after:content-['+']",
        removed: "bg-destructive/10 after:text-destructive after:content-['−']",
        highlighted: "bg-muted",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function CodeBlockLine({ className, variant = "default", children, ...props }: React.ComponentProps<"span"> & VariantProps<typeof codeBlockLineVariants>) {
  // An empty line holds a newline so copying a selection keeps blank lines.
  const empty = children === undefined || children === null || children === "" || (Array.isArray(children) && children.length === 0)
  return (
    <span data-slot="code-block-line" data-variant={variant} className={cn(codeBlockLineVariants({ variant }), className)} {...props}>
      <span data-slot="code-block-line-content" className="min-w-0">
        {empty ? "\n" : children}
      </span>
    </span>
  )
}

function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn("flex min-w-0 shrink-0 items-center gap-2 px-4 pb-4 text-muted-foreground group-data-[size=sm]/code-block:px-2 group-data-[size=sm]/code-block:pb-2", className)}
      {...props}
    />
  )
}

export { CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockActions, CodeBlockCopyButton, CodeBlockContent, CodeBlockLine, CodeBlockFooter }
