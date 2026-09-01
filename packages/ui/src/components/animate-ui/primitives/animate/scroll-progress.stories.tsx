import type { ComponentProps } from "react"
import {
  ScrollProgress as ScrollProgressImpl,
  ScrollProgressProvider,
  ScrollProgressContainer,
} from "./scroll-progress"

export default {
  title: "Components/Feedback/Scroll Progress",
  component: ScrollProgressImpl,
  argTypes: {
    mode: { control: "select", options: ["width", "height", "scaleY", "scaleX"] },
    style: { table: { disable: true } },
  },
  args: { mode: "width" },
}

export const ScrollProgressAnimate = (args: ComponentProps<typeof ScrollProgressImpl>) => (
  <ScrollProgressProvider>
    <div style={{ position: "relative", width: 320 }}>
      <ScrollProgressImpl
        {...args}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 4,
          backgroundColor: "#6366f1",
          zIndex: 1,
        }}
      />
      <ScrollProgressContainer
        style={{
          height: 200,
          overflowY: "auto",
          paddingTop: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        <div style={{ padding: 16 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} style={{ marginBottom: 12 }}>
              Scrollable content line {i + 1}
            </p>
          ))}
        </div>
      </ScrollProgressContainer>
    </div>
  </ScrollProgressProvider>
)
