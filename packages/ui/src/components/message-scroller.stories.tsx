import {
  MessageScroller as MessageScrollerImpl,
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerContent,
} from "./message-scroller"

export default { title: "Components/Message Scroller", component: MessageScrollerImpl }

export const MessageScroller = () => (
  <MessageScrollerProvider>
    <MessageScrollerImpl className="h-64">
      <MessageScrollerViewport>
        <MessageScrollerContent>
          <div>Message one</div>
          <div>Message two</div>
          <div>Message three</div>
        </MessageScrollerContent>
      </MessageScrollerViewport>
    </MessageScrollerImpl>
  </MessageScrollerProvider>
)
