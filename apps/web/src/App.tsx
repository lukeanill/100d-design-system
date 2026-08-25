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
          <a href="http://localhost:6006" target="_blank" rel="noopener noreferrer">
            Storybook
          </a>
        }
      />
    </div>
  )
}
