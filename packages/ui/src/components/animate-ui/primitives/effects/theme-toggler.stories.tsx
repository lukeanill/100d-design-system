import * as React from "react"
import { ThemeToggler as ThemeTogglerImpl } from "./theme-toggler"

export default {
  title: "Animation/Interactions/Theme Toggler",
  component: ThemeTogglerImpl,
  argTypes: {
    direction: { control: "select", options: ["btt", "ttb", "ltr", "rtl"] },
    theme: { table: { disable: true } },
    resolvedTheme: { table: { disable: true } },
    setTheme: { table: { disable: true } },
    onImmediateChange: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    direction: "ltr",
  },
}

export const ThemeTogglerEffects = (args: any) => {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")
  return (
    <ThemeTogglerImpl
      {...args}
      theme={theme}
      resolvedTheme={theme}
      setTheme={(next: "light" | "dark") => setTheme(next)}
    >
      {({ resolved, toggleTheme }: { resolved: string; toggleTheme: (t: "light" | "dark") => void }) => (
        <button
          onClick={() => toggleTheme(resolved === "light" ? "dark" : "light")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid #d4d4d8",
            background: resolved === "dark" ? "#18181b" : "#fff",
            color: resolved === "dark" ? "#fff" : "#18181b",
            cursor: "pointer",
          }}
        >
          Toggle theme (currently {resolved})
        </button>
      )}
    </ThemeTogglerImpl>
  )
}
