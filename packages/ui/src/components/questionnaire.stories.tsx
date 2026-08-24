import type { ComponentProps } from "react"
import { Questionnaire as QuestionnaireImpl } from "./questionnaire"

export default { title: "Components/Questionnaire", component: QuestionnaireImpl }

export const Questionnaire = (args: ComponentProps<typeof QuestionnaireImpl>) => <QuestionnaireImpl {...args} />
