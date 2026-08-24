import { Spring as SpringImpl, SpringProvider } from "./spring"

export default { title: "Animation/Spring Animate", component: SpringImpl }

export const SpringAnimate = () => (
  <SpringProvider>
    <SpringImpl />
  </SpringProvider>
)
