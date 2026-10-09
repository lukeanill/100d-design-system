import { PlayfulTodolist as PlayfulTodolistImpl } from "./playful-todolist"

export default {
  title: "Components/Content/Playful Todolist",
  component: PlayfulTodolistImpl,
  parameters: { controls: { disable: true } },
}

export const PlayfulTodolist = () => <PlayfulTodolistImpl />
