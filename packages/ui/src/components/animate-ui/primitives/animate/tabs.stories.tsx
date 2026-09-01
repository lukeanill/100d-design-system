import {
  Tabs as TabsImpl,
  TabsList,
  TabsHighlight,
  TabsHighlightItem,
  TabsTrigger,
  TabsContents,
  TabsContent,
} from "./tabs"

export default {
  title: "Animation/Tabs Animate",
  tags: ["!dev"],
  component: TabsImpl,
  argTypes: {
    children: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: {
    defaultValue: "account",
  },
}

const tabs = [
  { value: "account", label: "Account", content: "Manage your account details and preferences." },
  { value: "password", label: "Password", content: "Update your password and security settings." },
  { value: "team", label: "Team", content: "Invite teammates and manage roles." },
]

export const TabsAnimate = () => (
  <TabsImpl defaultValue="account" style={{ width: 320 }}>
    <TabsList
      style={{
        position: "relative",
        display: "flex",
        gap: 4,
        padding: 4,
        borderRadius: 8,
        backgroundColor: "#f3f4f6",
      }}
    >
      <TabsHighlight
        style={{ backgroundColor: "white", borderRadius: 6, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
      >
        {tabs.map((tab) => (
          <TabsHighlightItem key={tab.value} value={tab.value} style={{ flex: 1 }}>
            <TabsTrigger
              value={tab.value}
              style={{
                width: "100%",
                padding: "6px 12px",
                fontSize: 14,
                border: "none",
                background: "transparent",
                position: "relative",
                zIndex: 1,
              }}
            >
              {tab.label}
            </TabsTrigger>
          </TabsHighlightItem>
        ))}
      </TabsHighlight>
    </TabsList>
    <TabsContents style={{ marginTop: 12 }}>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} style={{ fontSize: 14, color: "#374151" }}>
          {tab.content}
        </TabsContent>
      ))}
    </TabsContents>
  </TabsImpl>
)
