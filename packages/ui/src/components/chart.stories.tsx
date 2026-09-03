import { BarChart, Bar, XAxis } from "recharts"
import { ChartContainer, type ChartConfig } from "./chart"

export default {
  title: "Components/Content/Chart",
  component: ChartContainer,
  parameters: { controls: { disable: true } },
}

const data = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 68 },
  { month: "Mar", value: 51 },
  { month: "Apr", value: 87 },
]

const config = {
  value: { label: "Value", color: "var(--chart-1)" },
} satisfies ChartConfig

export const Chart = () => (
  <ChartContainer config={config} className="h-64 w-full">
    <BarChart data={data}>
      <XAxis dataKey="month" />
      <Bar dataKey="value" fill="var(--color-value)" radius={4} />
    </BarChart>
  </ChartContainer>
)
