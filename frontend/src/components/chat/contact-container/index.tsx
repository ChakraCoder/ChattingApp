// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ResizablePanel } from "../../ui/resizable";
import IndividualChat from "./components/IndividualChat";
import NewDm from "./components/new-dm";
import ProfileInfo from "./components/profile-info";

const ContactsContainer = () => {
  return (
    <>
      <ResizablePanel
        defaultSize={25}
        minSize={25}
        maxSize={30}
        className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full"
      >
        <div className="pt-3">
          <Logo />
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Chats" />
            <NewDm />
          </div>
          <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
            <IndividualChat />
          </div>
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Group Chats" />
          </div>
          <ProfileInfo />
        </div>
      </ResizablePanel>
    </>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold text-white">ChakraChat</span>
    </div>
  );
};

const Title = ({ text }: { text: string }) => {
  return (
    <h6 className="uppercare tracking-widest text-neutral-100 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
