import type { ComponentProps } from "react"
import { IssueReportForm as IssueReportFormImpl, IssueReportFormContent } from "./issue-report-form"

export default { title: "Components/Issue Report Form", component: IssueReportFormImpl }

export const IssueReportForm = (args: ComponentProps<typeof IssueReportFormImpl>) => (
  <IssueReportFormImpl {...args}>
    <IssueReportFormContent />
  </IssueReportFormImpl>
)
