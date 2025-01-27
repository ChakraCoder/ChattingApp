import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/utils/utils";
import { useErrorHandler } from "@/hooks";
import { contactSearch } from "@/apis/contactsApiServices";
import { STATUS_CODES } from "@/constants/statusCodes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserState } from "@/types/userTypes";
import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  NODE_ENV,
} from "@/constants/env";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectedChatDetails,
  setSelectedChatData,
} from "@/app/slice/chatSlice";
import { addIndividualChat } from "@/apis/chatApiServices";

const NewDm = () => {
  const userId = useAppSelector((state) => state.user.id);
  const { allExistingChatsData } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const handleError = useErrorHandler();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState<UserState[]>([]);

  const searchContacts = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const searchedUsers = await contactSearch(searchTerm);

        if (searchedUsers.status === STATUS_CODES.OK) {
          setSearchedContacts(searchedUsers.data.data.users);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const selectNewContact = async (contact: UserState) => {
    try {
      setOpenNewContactModel(false);
      dispatch(setSelectedChatData(contact));
      setSearchedContacts([]);

      const existingChat = allExistingChatsData.find(
        (chat) =>
          !chat.isGroupChat && 
          chat.participants.some((participant) => participant.id === contact.id)
      );

      if (existingChat) {
        const { id, groupName, isGroupChat, createdAt, updatedAt } =
          existingChat;
        dispatch(
          selectedChatDetails({
            id,
            groupName,
            chatType: isGroupChat === true ? "GROUP" : "INDIVIDUAL",
            createdAt,
            updatedAt,
          })
        );
      } else {
        // Ensure that contact.id and userId are not null
        if (contact.id && userId) {
          const IndividualChatAdd = await addIndividualChat({
            isGroupChat: false,
            participants: [contact.id, userId],
          });

          const { id, groupName, isGroupChat, createdAt, updatedAt } =
            IndividualChatAdd.data.data.chat;
          dispatch(
            selectedChatDetails({
              id,
              groupName,
              chatType: isGroupChat === true ? "GROUP" : "INDIVIDUAL",
              createdAt,
              updatedAt,
            })
          );
        } else {
          throw new Error("User ID or contact ID is null");
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="bg-transparent border-none hover:bg-transparent hover:text-neutral-100 text-neutral-400 font-light text-opacity-90 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            >
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contact"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px] mt-5">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact: UserState) => {
                  return (
                    <div
                      key={contact.id}
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={() => {
                        selectNewContact(contact);
                      }}
                    >
                      <div className="w-12 h-12 relative">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          <AvatarImage
                            src={
                              contact.profileImage
                                ? `${
                                    NODE_ENV === "development"
                                      ? BACKEND_DEVELOPMENT_URL
                                      : BACKEND_DEPLOYED_URL
                                  }/profile-images/${contact.profileImage}`
                                : "/no-profile.jpg"
                            }
                            alt="profile"
                            className="object-cover w-full h-full bg-black"
                          />
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-white mb-1">
                          {contact.firstName &&
                            contact.lastName &&
                            `${contact.firstName} ${contact.lastName}`}
                        </p>
                        <p className="text-white">
                          {contact.userName && `${contact.userName} `}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {searchedContacts.length <= 0 && (
            <div className="flex-1 md:bg-[#1c1d25] flex flex-col justify-center items-center mt-5 duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white gap-5 lg:text-2xl text-xl text-center flex flex-col justify-center items-center mt-5 duration-300 transition-all">
                <h3 className="poppins-medium mt-3">
                  Search new<span className="text-purple-500"> Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDm;
