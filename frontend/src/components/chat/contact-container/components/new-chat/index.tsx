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
import CreateGroup from "../create-group";

const NewChat = () => {
  const [openNewDmModel, setOpenNewDmModel] = useState(false);
  const [openCreateGroupModel, setoOpenCreateGroupModel] = useState(false);

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
              setOpenNewDmModel(true);
            }}
          >
            Individual Chat
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              document.body.style.pointerEvents = "auto";
              setoOpenCreateGroupModel(true);
            }}
          >
            Group Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pass openNewDm state to NewDm */}
      <NewDm open={openNewDmModel} setOpen={setOpenNewDmModel} />
      <CreateGroup
        open={openCreateGroupModel}
        setOpen={setoOpenCreateGroupModel}
      />
    </>
  );
};

export default NewChat;
