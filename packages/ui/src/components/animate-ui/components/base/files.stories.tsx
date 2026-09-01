import type { ComponentProps } from "react"
import { Files as FilesImpl, FolderItem, FolderTrigger, FolderPanel, FileItem } from "./files"

export default {
  title: "Components/Content/Files",
  component: FilesImpl,
  args: { defaultOpen: ["src"] },
}

export const Files = (args: ComponentProps<typeof FilesImpl>) => (
  <FilesImpl {...args}>
    <FolderItem value="src">
      <FolderTrigger>src</FolderTrigger>
      <FolderPanel>
        <FileItem>index.ts</FileItem>
        <FileItem>utils.ts</FileItem>
      </FolderPanel>
    </FolderItem>
    <FileItem>package.json</FileItem>
  </FilesImpl>
)
