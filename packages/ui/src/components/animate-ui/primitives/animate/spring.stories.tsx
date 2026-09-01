import { Spring as SpringImpl, SpringProvider, SpringElement } from "./spring"

export default { title: "Animation/Spring Animate", component: SpringImpl, tags: ["!dev"] }

export const SpringAnimate = () => (
  <SpringProvider>
    <div
      style={{
        position: "relative",
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SpringImpl style={{ position: "absolute", color: "#6366f1" }} />
      <SpringElement>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            backgroundColor: "#6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Drag
        </div>
      </SpringElement>
    </div>
  </SpringProvider>
)
