import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks";
import ContactsContainer from "@/components/chat/contact-container";
import ChatContainer from "@/components/chat/ChatContainer";
import EmptyChatContainer from "@/components/chat/EmptyChatContainer";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userName = useAppSelector((state) => state.user.userName);
  const { selectedChatType } = useAppSelector((state) => state.chat);

  useEffect(() => {
    (() => {
      if (userName === null) {
        navigate("/profile");
        toast({
          description: "Username is required.",
        });
      }
    })();
  }, [navigate, toast, userName]);

  return (
    <div className="flex h-screen w-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex h-full w-full"
      >
        <ContactsContainer />
        <ResizableHandle className="border-r-2 border-[#2f303b]" />
        {selectedChatType === null ? (
          <EmptyChatContainer />
        ) : (
          <ChatContainer />
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
