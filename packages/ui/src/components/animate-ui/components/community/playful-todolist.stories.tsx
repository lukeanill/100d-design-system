import { PlayfulTodolist as PlayfulTodolistImpl } from "./playful-todolist"

export default {
  title: "Components/Actions/Playful Todolist",
  component: PlayfulTodolistImpl,
  parameters: { controls: { disable: true } },
}

export const PlayfulTodolist = () => <PlayfulTodolistImpl />
