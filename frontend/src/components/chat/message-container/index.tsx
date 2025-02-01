import { useAppDispatch, useAppSelector } from "@/app/hooks";
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
import { useErrorHandler } from "@/hooks";
import { setSelectedChatMessages } from "@/app/slice/chatSlice";
import { getChatMessages } from "@/apis/messageApiService";
import { cleanFileName } from "@/utils/utils";
import { Download } from "lucide-react";
import { getFileTypeIcon } from "@/utils/getFileTypeIcon";
import { handleDownload } from "@/utils/handleDownload";

const MessageContainer = () => {
  const { scrollRef, scrollToBottom, disableAutoScroll } = useAutoScroll();
  const { selectedChatMessages, selectedChatDetails, typingIndicator } =
    useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user);
  const handleError = useErrorHandler();

  // Trigger scroll when new messages arrive
  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        if (selectedChatDetails) {
          const messages = await getChatMessages(selectedChatDetails.id);
          dispatch(setSelectedChatMessages(messages.data.data.chatMessage));
        }
      } catch (error) {
        handleError(error);
      }
    };
    fetchChatMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatDetails]);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatMessages, typingIndicator]);

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
          {renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message: Message) => {
    const messageTime = moment(message.updatedAt).format("LT");
    return (
      <>
        {/* TEXT MESSAGE */}
        {message.type === "TEXT" && (
          <ChatMessageList>
            <ChatBubble
              variant={message.senderId === userInfo.id ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                src={
                  message.sender.profileImage !== null
                    ? `${
                        NODE_ENV === "development"
                          ? BACKEND_DEVELOPMENT_URL
                          : BACKEND_DEPLOYED_URL
                      }/${message.sender.profileImage}`
                    : "/no-profile.jpg"
                }
              />
              <ChatBubbleMessage
                variant={message.senderId === userInfo.id ? "sent" : "received"}
              >
                <div className="flex flex-col">
                  {selectedChatDetails?.chatType === "GROUP" && (
                    <div className="flex justify-start pb-3">
                      <div className="text-xs text-neutral-400">
                        {`~ ` + message.sender.userName}
                      </div>
                    </div>
                  )}
                  <div className="text-base">{message.content}</div>
                  <div className="flex justify-end pt-1">
                    <div className="text-xs text-neutral-400">
                      {messageTime}
                    </div>
                  </div>
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          </ChatMessageList>
        )}

        {/* IMAGE MESSAGE */}
        {message.type === "IMAGE" && (
          <ChatMessageList>
            <ChatBubble
              variant={message.senderId === userInfo.id ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                src={
                  message.sender.profileImage !== null
                    ? `${
                        NODE_ENV === "development"
                          ? BACKEND_DEVELOPMENT_URL
                          : BACKEND_DEPLOYED_URL
                      }/${message.sender.profileImage}`
                    : "/no-profile.jpg"
                }
              />
              <ChatBubbleMessage
                variant={message.senderId === userInfo.id ? "sent" : "received"}
              >
                <div className="flex flex-col">
                  {selectedChatDetails?.chatType === "GROUP" && (
                    <div className="flex justify-start pb-3">
                      <div className="text-xs text-neutral-400">
                        {`~ ` + message.sender.userName}
                      </div>
                    </div>
                  )}
                  {/* Display Image */}
                  <div className="flex justify-center flex-col">
                    <div>
                      <img
                        src={`${
                          NODE_ENV === "development"
                            ? BACKEND_DEVELOPMENT_URL
                            : BACKEND_DEPLOYED_URL
                        }/${message.fileName}`}
                        alt="Sent Image"
                        className="max-w-[200px] max-h-[200px] rounded-lg border"
                      />
                    </div>
                    <div className="flex justify-end items-end pt-2">
                      <button
                        onClick={() =>
                          handleDownload(
                            `${
                              NODE_ENV === "development"
                                ? BACKEND_DEVELOPMENT_URL
                                : BACKEND_DEPLOYED_URL
                            }/${message.fileName}`,
                            message.fileName
                          )
                        }
                        className="text-blue-500 hover:underline"
                      >
                        <Download />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <div className="text-xs text-neutral-400">
                      {messageTime}
                    </div>
                  </div>
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          </ChatMessageList>
        )}

        {/* FILE MESSAGE */}
        {message.type === "FILE" && (
          <ChatMessageList>
            <ChatBubble
              variant={message.senderId === userInfo.id ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                src={
                  message.sender.profileImage !== null
                    ? `${
                        NODE_ENV === "development"
                          ? BACKEND_DEVELOPMENT_URL
                          : BACKEND_DEPLOYED_URL
                      }/${message.sender.profileImage}`
                    : "/no-profile.jpg"
                }
              />
              <ChatBubbleMessage
                variant={message.senderId === userInfo.id ? "sent" : "received"}
              >
                <div className="flex flex-col">
                  {selectedChatDetails?.chatType === "GROUP" && (
                    <div className="flex justify-start pb-3">
                      <div className="text-xs text-neutral-400">
                        {`~ ` + message.sender.userName}
                      </div>
                    </div>
                  )}

                  {/* Display File Link with Icon */}
                  <div className="flex items-center gap-2 rounded-lg border-none">
                    {getFileTypeIcon(message.fileName)}
                    <span className="text-sm">
                      {cleanFileName(message.fileName)}
                    </span>
                    <button
                      onClick={() =>
                        handleDownload(
                          `${
                            NODE_ENV === "development"
                              ? BACKEND_DEVELOPMENT_URL
                              : BACKEND_DEPLOYED_URL
                          }/${message.fileName}`,
                          message.fileName
                        )
                      }
                      className="text-blue-500 hover:underline"
                    >
                      <Download />
                    </button>
                  </div>
                  <div className="flex justify-end pt-1">
                    <div className="text-xs text-neutral-400">
                      {messageTime}
                    </div>
                  </div>
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          </ChatMessageList>
        )}
      </>
    );
  };

  return (
    <div
      className="flex-col overflow-y-auto scrollbar-hidden w-full h-full"
      ref={scrollRef}
      onScroll={disableAutoScroll}
    >
      <div>{renderMessages()}</div>
      <div>
        {/* Typing Indicator */}
        {selectedChatDetails &&
          typingIndicator[selectedChatDetails.id] &&
          typingIndicator[selectedChatDetails.id] !== userInfo.id && (
            <ChatMessageList>
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  src={
                    typingIndicator[selectedChatDetails.id]?.profileImage !==
                    null
                      ? `${
                          NODE_ENV === "development"
                            ? BACKEND_DEVELOPMENT_URL
                            : BACKEND_DEPLOYED_URL
                        }/${
                          typingIndicator[selectedChatDetails.id]?.profileImage
                        }`
                      : "/no-profile.jpg"
                  }
                />

                {selectedChatDetails?.chatType === "GROUP" && (
                  <ChatBubbleMessage variant="received">
                    <div className="flex justify-start">
                      <div className="text-xs text-neutral-400">
                        {`~ ` +
                          typingIndicator[selectedChatDetails.id]?.userName}
                      </div>
                    </div>
                    <ChatBubbleMessage isLoading />
                  </ChatBubbleMessage>
                )}

                {selectedChatDetails?.chatType === "INDIVIDUAL" && (
                  <ChatBubbleMessage isLoading />
                )}
              </ChatBubble>
            </ChatMessageList>
          )}
      </div>
    </div>
  );
};

export default MessageContainer;
