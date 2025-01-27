import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks";
import ContactsContainer from "@/components/chat/contact-container";
import ChatContainer from "@/components/chat/ChatContainer";
import EmptyChatContainer from "@/components/chat/EmptyChatContainer";
import { getAllUserChats } from "@/apis/chatApiServices";
import { setAllExistingChatsData } from "@/app/slice/chatSlice";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const userName = useAppSelector((state) => state.user.userName);
  const selectedChatType = useAppSelector(
    (state) => state.chat.selectedChatDetails?.chatType
  );

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

  useEffect(() => {
    (async () => {
      const allUserChats = await getAllUserChats();
      dispatch(setAllExistingChatsData(allUserChats.data.data.chat));
    })();
  }, [dispatch]);

  return (
    <div className="flex h-screen w-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex h-full w-full"
      >
        <ContactsContainer />
        <ResizableHandle className="border-r-2 border-[#2f303b]" />
        {selectedChatType === undefined ? (
          <EmptyChatContainer />
        ) : (
          <ChatContainer />
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
