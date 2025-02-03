import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, useErrorHandler } from "@/hooks";
import { contactSearch } from "@/apis/contactsApiServices";
import { STATUS_CODES } from "@/constants/statusCodes";
import MultipleSelector from "@/components/ui/multiple-select";
import { UserState } from "@/types/userTypes";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setSelectedChatDetails } from "@/app/slice/chatSlice";
import { addGroupChat } from "@/apis/chatApiServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";

// Interface for the form data
interface FormData {
  groupName: string;
  participants: UserState[];
}

const CreateGroup = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) => {
  const userId = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();
  const handleError = useErrorHandler();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      groupName: "",
      participants: [],
    },
  });

  // Search Contacts
  const searchContacts = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const searchedUsers = await contactSearch(searchTerm);
        if (searchedUsers.status === STATUS_CODES.OK) {
          return searchedUsers.data.data.users.map((contact: UserState) => ({
            label: contact.userName,
            value: contact.id,
            data: contact,
          }));
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Handle Selection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (selectedOptions: any) => {
    if (Array.isArray(selectedOptions)) {
      setValue(
        "participants",
        selectedOptions.map((option) => option.data)
      );
    }
  };

  // Handle Group Creation
  const onSubmit = async (data: FormData) => {
    try {
      const { groupName, participants } = data;

      // Validate participants (at least 2 participants are needed)
      if (participants.length < 2) {
        toast({
          description:
            "At least two participants are required for a group chat",
        });
        return;
      }

      // Create payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        isGroupChat: true,
        groupName,
        participants: participants.map((contact) => contact.id).concat(userId),
      };
      // Call API to create group chat
      await createGroup(payload);
    } catch (error) {
      handleError(error);
    }
  };

  // API Call to Create Group
  const createGroup = async (payload: {
    isGroupChat: boolean;
    groupName: string;
    participants: string[];
  }) => {
    try {
      setOpen(false);
      const groupChatAdd = await addGroupChat(payload);
      const { id, groupName, isGroupChat, participants, createdAt, updatedAt } =
        groupChatAdd.data.data.chat;
      dispatch(
        setSelectedChatDetails({
          id,
          groupName,
          chatType: isGroupChat === true ? "GROUP" : "INDIVIDUAL",
          participants,
          createdAt,
          updatedAt,
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full p-4 justify-between">
          {/* Group Name Input */}
          <Controller
            name="groupName"
            control={control}
            rules={{ required: "Group name is required", maxLength: 100 }}
            render={({ field }) => (
              <Input
                {...field}
                className="bg-[#181920] text-white mb-2"
                placeholder="Group Name"
              />
            )}
          />
          {errors.groupName && (
            <p className="text-red-500 text-sm">{errors.groupName.message}</p>
          )}

          {/* Contact Selector */}
          <MultipleSelector
            className="text-white mt-4"
            onSearch={searchContacts}
            onChange={handleSelect}
            placeholder="Search Contact"
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                loading...
              </p>
            }
            emptyIndicator={
              <p className="w-full text-center text-lg leading-10 text-muted-foreground">
                no results found.
              </p>
            }
          />
          {errors.participants && (
            <p className="text-red-500 text-sm">
              At least two participants are required.
            </p>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit(onSubmit)}
            className="rounded-full p-6 w-full border mt-auto"
          >
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
