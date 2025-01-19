import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";

const MessageBar = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emojiRef = useRef<any>();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji: { emoji: string }) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  const handleSendMessage = async () => {};
  return (
    <div className="h-[12vh] bg-[#1c1d25]  p-4 flex flex-row">
      <ChatInput
        value={message}
        placeholder="Type a message..."
        className="focus:border-none border-none bg-[#2a2b33] text-white rounded-none"
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        variant="outline"
        size="icon"
        className="size-12 border-none rounded-none bg-[#2a2b33] text-white"
        onClick={() => setEmojiPickerOpen(true)}
      >
        <RiEmojiStickerLine className="text-2xl" />
      </Button>
      <div className="absolute bottom-16 right-0" ref={emojiRef}>
        <EmojiPicker
          // @ts-expect-error abc
          theme="dark"
          open={emojiPickerOpen}
          onEmojiClick={handleAddEmoji}
          autoFocusSearch={false}
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        className="size-12 border-none rounded-none bg-[#2a2b33] text-white"
      >
        <GrAttachment className="text-2xl " />
      </Button>
      <div className="ml-2">
        <Button
          variant="outline"
          size="icon"
          className="size-12 bg-[#8417ff] hover:bg-[#741bda] focus:bg-[#741bda] outline-none border-none text-white hover:text-white duration-300 transition-all"
          onClick={handleSendMessage}
        >
          <SendHorizontal className="text-2xl" />
        </Button>
      </div>
    </div>
  );
};

export default MessageBar;
