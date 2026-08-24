import type { ComponentProps } from "react"
import { MapMeteor as MapMeteorImpl } from "./meteor"

export default { title: "Map/Meteor", component: MapMeteorImpl }

export const Meteor = (args: ComponentProps<typeof MapMeteorImpl>) => <MapMeteorImpl {...args} />
