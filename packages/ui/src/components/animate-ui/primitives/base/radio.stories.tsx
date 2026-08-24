import { Radio as RadioImpl, RadioGroup } from "./radio"

export default { title: "Animation/Radio Base", component: RadioImpl }

export const RadioBase = () => (
  <RadioGroup defaultValue="a">
    <RadioImpl value="a" />
  </RadioGroup>
)
