import { Radio as RadioImpl, RadioGroup } from "./radio"

export default { title: "Components/Radio", component: RadioImpl }

export const Radio = () => (
  <RadioGroup defaultValue="a">
    <RadioImpl value="a" />
  </RadioGroup>
)
