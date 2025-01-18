import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample user data with last message and unread count
const users = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/path/to/john-avatar.jpg",
    lastMessage: "Hey, how's it going?",
    unreadMessages: 2,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/path/to/jane-avatar.jpg",
    lastMessage: "Let's catch up soon!",
    unreadMessages: 0,
  },
  {
    id: 3,
    name: "Michael Lee",
    avatar: "/path/to/michael-avatar.jpg",
    lastMessage: "Good to hear from you!",
    unreadMessages: 5,
  },
  {
    id: 4,
    name: "Sarah Johnson",
    avatar: "/path/to/sarah-avatar.jpg",
    lastMessage: "Can we reschedule the meeting?",
    unreadMessages: 1,
  },
];

const Chat = () => {
  return (
    <div className="flex h-screen w-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex h-full w-full"
      >
        {/* Sidebar - User List (Chat Clickers) */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full bg-slate-700 text-white p-4 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Users</h3>
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 mb-3 bg-slate-800 rounded-md cursor-pointer hover:bg-slate-600"
              >
                {/* Profile Image and Name */}
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-black">
                      {user.name[0] + user.name[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">{user.name}</p>
                    <p className="text-sm text-gray-300">{user.lastMessage}</p>
                  </div>
                </div>

                {/* Unread Messages */}
                {user.unreadMessages > 0 && (
                  <div className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs rounded-full">
                    {user.unreadMessages}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Main Chat Area */}
        <ResizablePanel defaultSize={80} minSize={70}>
          <div className="h-full w-full bg-white flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <ChatMessageList>
                <ChatBubble variant="sent">
                  <ChatBubbleAvatar fallback="US" />
                  <ChatBubbleMessage variant="sent">
                    Hello, how has your day been? I hope you are doing well.
                  </ChatBubbleMessage>
                </ChatBubble>
                <ChatBubble variant="received">
                  <ChatBubbleAvatar fallback="AI" />
                  <ChatBubbleMessage variant="received">
                    Hi, I am doing well, thank you for asking. How can I help
                    you today?
                  </ChatBubbleMessage>
                </ChatBubble>
                <ChatBubble variant="received">
                  <ChatBubbleAvatar fallback="AI" />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              </ChatMessageList>
            </div>

            {/* Chat Input */}
            <div className="border-t p-4 bg-gray-50 flex flex-row">
              <ChatInput
                placeholder="Type a message..."
                className="border-gray-500 focus-visible:border-none"
              />
              <div className="ml-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 border-gray-500"
                >
                  <SendHorizontal />
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
