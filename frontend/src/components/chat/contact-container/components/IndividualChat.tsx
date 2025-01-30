import { useAppSelector } from "@/app/hooks";
import {
  setSelectedChatMessages,
  selectedChatDetails as setSelectedChatDetails,
  setSelectedChatData,
} from "@/app/slice/chatSlice";
import { AvatarImage } from "@/components/ui/avatar";
import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  NODE_ENV,
} from "@/constants/env";
import { ChatDetails } from "@/types/chatTypes";
import { Avatar } from "@radix-ui/react-avatar";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const IndividualChat = () => {
  const [chats, setChats] = useState<ChatDetails[]>([]);
  const userId = useAppSelector((state) => state.user.id);
  const dispatch = useDispatch();
  const { allExistingChatsData, selectedChatDetails } = useAppSelector(
    (state) => state.chat
  );

  useEffect(() => {
    const fetchChats = () => {
      const filteredChats = allExistingChatsData.filter(
        (chat) => !chat.groupName
      );

      // Filter participants where id is not equal to userId
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedChats: any = filteredChats
        .map((chat: ChatDetails) => {
          const participant = chat.participants.find(
            (participant) => participant.id !== userId
          );
          if (participant) {
            return {
              ...chat,
              participants: [participant],
            };
          }
          return null;
        })
        .filter(Boolean);
      setChats(updatedChats);
    };

    fetchChats();
  }, [allExistingChatsData, userId, selectedChatDetails]);

  // @ts-expect-error chat type
  const handleClick = (chat) => {
    if (selectedChatDetails?.id === chat.id) {
      setSelectedChatMessages([]);
    }
    const { id, groupName, createdAt, updatedAt } = chat;
    dispatch(
      setSelectedChatDetails({
        id,
        groupName,
        chatType: "INDIVIDUAL",
        createdAt,
        updatedAt,
      })
    );
    dispatch(setSelectedChatData(chat.participants[0]));
  };

  return (
    <div>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              selectedChatDetails?.id === chat.id
                ? "bg-[#f1f1f111]"
                : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => handleClick(chat)}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300 ">
              <div className="w-12 h-12 relative">
                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                  <AvatarImage
                    src={
                      chat.participants[0].profileImage
                        ? `${
                            NODE_ENV === "development"
                              ? BACKEND_DEVELOPMENT_URL
                              : BACKEND_DEPLOYED_URL
                          }/${chat.participants[0].profileImage}`
                        : "/no-profile.jpg"
                    }
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                </Avatar>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex flex-row">
                  <p className="text-white text-base">
                    {chat.participants[0].userName &&
                      `${chat.participants[0].userName} `}
                  </p>
                  <div className="flex w-full px-4 justify-end items-end">
                    <p className="text-gray-400 my-1 text-sm">
                      {moment(chat.latestMessage?.timestamp).format("LT")}
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 my-1 text-sm">
                  {(() => {
                    const message = chat.latestMessage;
                    const content = message?.content || message?.fileName;
                    if (content && content?.length > 30) {
                      return `${content.slice(0, 28)}...`;
                    }
                    return content;
                  })()}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndividualChat;
