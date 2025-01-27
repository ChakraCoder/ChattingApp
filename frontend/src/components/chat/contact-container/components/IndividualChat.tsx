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
import { ChatDetails, LatestMessage } from "@/types/chatTypes";
import { Avatar } from "@radix-ui/react-avatar";
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
        .map((chat) => {
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
  }, [allExistingChatsData, userId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (chat: { id: any; isGroupChat?: boolean; groupName?: any; createdAt?: any; updatedAt?: any; participants?: any; latestMessage?: LatestMessage | null; }) => {
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
                ? "bg-[#8417fs] hover:bg-[8417ff]"
                : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => handleClick(chat)}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300">
              <div className="w-12 h-12 relative">
                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                  <AvatarImage
                    src={
                      chat.participants[0].profileImage
                        ? `${
                            NODE_ENV === "development"
                              ? BACKEND_DEVELOPMENT_URL
                              : BACKEND_DEPLOYED_URL
                          }/profile-images/${chat.participants[0].profileImage}`
                        : "/no-profile.jpg"
                    }
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                </Avatar>
              </div>
              <div>
                <p className="text-white mb-1">
                  {chat.participants[0].firstName &&
                    chat.participants[0].lastName &&
                    `${chat.participants[0].firstName} ${chat.participants[0].lastName}`}
                </p>
                <p className="text-white">
                  {chat.participants[0].userName &&
                    `${chat.participants[0].userName} `}
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
