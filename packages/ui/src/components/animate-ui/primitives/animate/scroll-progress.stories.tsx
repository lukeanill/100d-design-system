import { ScrollProgress as ScrollProgressImpl, ScrollProgressProvider } from "./scroll-progress"

export default { title: "Animation/Scroll Progress Animate", component: ScrollProgressImpl }

export const ScrollProgressAnimate = () => (
  <ScrollProgressProvider>
    <ScrollProgressImpl />
  </ScrollProgressProvider>
)
