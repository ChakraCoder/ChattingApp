import { ResizablePanel } from "../ui/resizable";
import ChatHeader from "./chat-header";
import MessageBar from "./message-bar";
import MessageContainer from "./message-container";

const ChatContainer = () => {
  return (
    <>
      <ResizablePanel
        defaultSize={80}
        minSize={70}
        className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1"
      >
        <ChatHeader />
        <MessageContainer />
        <MessageBar />
      </ResizablePanel>
    </>
  );
};

export default ChatContainer;
