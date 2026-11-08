import React from "react"
import { addons, types } from "storybook/manager-api"
import { AddonPanel } from "storybook/internal/components"
import { TokensPanel } from "./panel"

addons.register("ds-tokens", () => {
  addons.add("ds-tokens/panel", {
    type: types.PANEL,
    title: "Tokens",
    render: ({ active }) => (
      <AddonPanel active={!!active}>
        <TokensPanel />
      </AddonPanel>
    ),
  })
})
