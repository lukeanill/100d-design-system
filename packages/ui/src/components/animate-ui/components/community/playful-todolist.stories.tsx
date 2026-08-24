import type { ComponentProps } from "react"
import { PlayfulTodolist as PlayfulTodolistImpl } from "./playful-todolist"

export default { title: "Components/Playful Todolist", component: PlayfulTodolistImpl }

export const PlayfulTodolist = (args: ComponentProps<typeof PlayfulTodolistImpl>) => <PlayfulTodolistImpl {...args} />
