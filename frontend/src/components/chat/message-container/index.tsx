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
import { useSocket } from "@/socket/useSocket";

const MessageContainer = () => {
  const { scrollRef, scrollToBottom, disableAutoScroll } = useAutoScroll();
  const { selectedChatMessages, selectedChatDetails, typingIndicator } =
    useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user);
  const handleError = useErrorHandler();
  const socket = useSocket();
  // Trigger scroll when new messages arrive

  useEffect(() => {
    try {
      if (socket && selectedChatDetails) {
        if (userInfo.id) {
          socket.emit("readMessage", {
            userId: userInfo.id,
            chatId: selectedChatDetails.id,
          });
        }
      }
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatDetails]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        if (selectedChatDetails) {
          const response = await getChatMessages(selectedChatDetails.id);
          const messages = response.data.data.chatMessage;

          // Dispatch messages to Redux
          dispatch(setSelectedChatMessages(messages));
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
                  <div className="flex flex-col  p-3 rounded-lg shadow-md">
                    {/* Sender Name (Only for Group Chats) */}
                    {selectedChatDetails?.chatType === "GROUP" && (
                      <div className="pb-2">
                        <span className="text-xs text-gray-500 font-semibold">
                          ~ {message.sender.userName}
                        </span>
                      </div>
                    )}

                    {/* Image Display */}
                    <div className="flex flex-col items-center">
                      <img
                        src={`${
                          NODE_ENV === "development"
                            ? BACKEND_DEVELOPMENT_URL
                            : BACKEND_DEPLOYED_URL
                        }/${message.fileName}`}
                        alt="Sent Image"
                        className="max-w-[250px] max-h-[250px] rounded-lg border shadow-sm cursor-pointer"
                        onClick={() =>
                          window.open(
                            `${
                              NODE_ENV === "development"
                                ? BACKEND_DEVELOPMENT_URL
                                : BACKEND_DEPLOYED_URL
                            }/${message.fileName}`,
                            "_blank"
                          )
                        }
                      />
                    </div>

                    {/* Buttons: Open & Download */}
                    <div className="flex justify-end pt-3">
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
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center"
                      >
                        <Download className="mt-2 w-6 h-6" />
                      </button>
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
                  {/* Sender Name for Group Chats */}
                  {selectedChatDetails?.chatType === "GROUP" && (
                    <div className="pb-2">
                      <span className="text-xs text-gray-500 font-semibold">
                        ~ {message.sender.userName}
                      </span>
                    </div>
                  )}

                  {/* File Display */}
                  <div className="flex items-center gap-3 p-2 rounded-lg shadow-sm">
                    {/* File Type Icon */}
                    {getFileTypeIcon(message.fileName)}

                    {/* Clickable File Name */}
                    <button
                      onClick={() =>
                        window.open(
                          `${
                            NODE_ENV === "development"
                              ? BACKEND_DEVELOPMENT_URL
                              : BACKEND_DEPLOYED_URL
                          }/${message.fileName}`,
                          "_blank"
                        )
                      }
                      className=" hover:underline text-sm font-medium"
                    >
                      {cleanFileName(message.fileName)}
                    </button>

                    {/* Download Button */}
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
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Timestamp */}
                  <div className="flex justify-end pt-1">
                    <span className="text-xs text-gray-500">{messageTime}</span>
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
