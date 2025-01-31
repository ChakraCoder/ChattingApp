import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import NewDm from "../new-dm";
import { useState } from "react";

const NewChat = () => {
  const [openNewDm, setOpenNewDm] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-transparent border-none hover:bg-transparent hover:text-neutral-100 text-neutral-400">
            <Plus />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              document.body.style.pointerEvents = "auto";
              setOpenNewDm(true);
            }}
          >
            Individual Chat
          </DropdownMenuItem>
          <DropdownMenuItem>Group Chat</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pass openNewDm state to NewDm */}
      <NewDm open={openNewDm} setOpen={setOpenNewDm} />
    </>
  );
};

export default NewChat;
