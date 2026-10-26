import type { ThemeValues, ValueAnswer } from "./types"

/** The UX direction questions, from the Figma `values` collection. */
export interface ValueQuestion {
  key: string
  question: string
  a: { label: string; description: string }
  b: { label: string; description: string }
}

export const VALUE_QUESTIONS: ValueQuestion[] = [
  {
    key: "guided-exploratory",
    question: "How should people find their way around?",
    a: { label: "Guided", description: "We show you the way, step by step." },
    b: { label: "Exploratory", description: "We let you look around and find your own way." },
  },
  {
    key: "automated-in-control",
    question: "Who should make the decisions?",
    a: { label: "Automated", description: "We do things for you so you don't have to." },
    b: { label: "In control", description: "You decide what happens and when." },
  },
  {
    key: "simple-powerful",
    question: "Should it be quick to use, or packed with options?",
    a: { label: "Simple", description: "You only see what you need right now." },
    b: { label: "Powerful", description: "Everything you might need is within reach." },
  },
  {
    key: "human-professional",
    question: "How should we talk to people?",
    a: { label: "Casual", description: "We talk to you like a friend." },
    b: { label: "Professional", description: "We keep things to the point." },
  },
]

/** Every preset starts on the first option of each question. */
export const DEFAULT_VALUES: ThemeValues = ["a", "a", "a", "a"]

export const answerOf = (index: number, answer: ValueAnswer) => VALUE_QUESTIONS[index][answer]
