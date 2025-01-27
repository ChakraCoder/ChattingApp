import { useAppSelector } from "@/app/hooks";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { useAutoScroll } from "@/components/ui/chat/hooks/useAutoScroll";
import moment from "moment";
import { Message } from "@/types/chatTypes";
import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  NODE_ENV,
} from "@/constants/env";
import { useEffect } from "react";

const MessageContainer = () => {
  const { scrollRef, scrollToBottom, disableAutoScroll } = useAutoScroll();
  const { selectedChatMessages, selectedChatData, selectedChatDetails } =
    useAppSelector((state) => state.chat);
  const userInfo = useAppSelector((state) => state.user);

  // Trigger scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate: string | null = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.createdAt).format("LL")}
            </div>
          )}
          {selectedChatDetails?.chatType === "INDIVIDUAL" &&
            renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message: Message) => {
    const messageTime = moment(message.updatedAt).format("LT");

    return (
      message.type === "TEXT" && (
        <ChatMessageList>
          <ChatBubble
            variant={
              message.senderId !== selectedChatData?.id ? "sent" : "received"
            }
          >
            <ChatBubbleAvatar
              src={`${
                NODE_ENV === "development"
                  ? BACKEND_DEVELOPMENT_URL
                  : BACKEND_DEPLOYED_URL
              }/profile-images/${
                message.senderId !== selectedChatData?.id
                  ? userInfo.profileImage || "no-profile.jpg"
                  : selectedChatData?.profileImage || "no-profile.jpg"
              }`}
            />
            <ChatBubbleMessage
              variant={
                message.senderId !== selectedChatData?.id ? "sent" : "received"
              }
            >
              {message.content}
            </ChatBubbleMessage>
            <div className="text-xs text-white">{messageTime}</div>
          </ChatBubble>
        </ChatMessageList>
      )
    );
  };

  return (
    <div
      className="flex-1 overflow-y-auto scrollbar-hidden w-full"
      ref={scrollRef}
      onScroll={disableAutoScroll} // Disable auto-scroll when the user manually scrolls
    >
      {renderMessages()}
    </div>
  );
};

export default MessageContainer;
