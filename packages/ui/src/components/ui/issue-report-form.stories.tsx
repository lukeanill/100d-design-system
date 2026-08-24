import type { ComponentProps } from "react"
import { IssueReportForm as IssueReportFormImpl } from "./issue-report-form"

export default { title: "Components/Issue Report Form", component: IssueReportFormImpl }

export const IssueReportForm = (args: ComponentProps<typeof IssueReportFormImpl>) => <IssueReportFormImpl {...args} />
