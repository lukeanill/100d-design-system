import { Link } from "react-router"
import { Button } from "@workspace/ui/components/button"
import { ThemeTogglerButton } from "@workspace/ui/components/animate-ui/components/buttons/theme-toggler"

export function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Design System</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" nativeButton={false} render={<Link to="/tokens">Tokens</Link>} />
          <Button variant="outline" nativeButton={false} render={<Link to="/history">History</Link>} />
          <ThemeTogglerButton variant="outline" modes={["light", "dark", "glass"]} />
        </div>
      </div>

      <Button
        variant="outline"
        nativeButton={false}
        className="self-start"
        render={
          <a
            href="https://100d-design-system-jtmyxto3x-lukeai-100.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Storybook"
          >
            Storybook
          </a>
        }
      />
    </div>
  )
}
