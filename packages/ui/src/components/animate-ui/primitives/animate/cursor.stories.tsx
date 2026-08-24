import { Cursor as CursorImpl, CursorProvider } from "./cursor"

export default { title: "Animation/Cursor Animate", component: CursorImpl }

export const CursorAnimate = () => (
  <CursorProvider>
    <CursorImpl />
  </CursorProvider>
)
