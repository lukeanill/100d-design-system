import type { ComponentProps } from "react"
import {
  Questionnaire as QuestionnaireImpl,
  QuestionnaireItem,
  QuestionnaireTitle,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireActions,
  QuestionnaireNext,
  QuestionnaireProgress,
} from "./questionnaire"

export default {
  title: "Components/Selects/Questionnaire",
  component: QuestionnaireImpl,
  argTypes: {
    shortcuts: {
      control: "select",
      options: ["letters", "numbers"],
    },
    onItemChange: { table: { disable: true } },
    onReset: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
  },
  args: { shortcuts: "letters" },
}

export const Questionnaire = (args: ComponentProps<typeof QuestionnaireImpl>) => (
  <QuestionnaireImpl {...args} className="w-96">
    <QuestionnaireProgress />
    <QuestionnaireItem name="favorite-color">
      <QuestionnaireTitle>What's your favorite color?</QuestionnaireTitle>
      <QuestionnaireChoices>
        <QuestionnaireChoice value="red">Red</QuestionnaireChoice>
        <QuestionnaireChoice value="blue">Blue</QuestionnaireChoice>
        <QuestionnaireChoice value="green">Green</QuestionnaireChoice>
      </QuestionnaireChoices>
    </QuestionnaireItem>
    <QuestionnaireActions>
      <QuestionnaireNext>Next</QuestionnaireNext>
    </QuestionnaireActions>
  </QuestionnaireImpl>
)
