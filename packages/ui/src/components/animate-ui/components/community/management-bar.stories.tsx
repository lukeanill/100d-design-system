import { ManagementBar as ManagementBarImpl } from "./management-bar"

export default {
  title: "Components/Actions/Management Bar",
  component: ManagementBarImpl,
  parameters: { controls: { disable: true } },
}

export const ManagementBar = () => <ManagementBarImpl />
