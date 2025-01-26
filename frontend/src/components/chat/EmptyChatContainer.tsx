import { animationDefaultOptions } from "@/utils/utils";
import { ResizablePanel } from "../ui/resizable";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <ResizablePanel
      defaultSize={80}
      minSize={70}
      className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all"
    >
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 item-center mt-10 lg:text-4xl text-3xl duration-300 transition-all text-center">
        <h3 className="poppins-medium">
          Welcome to <span className="text-purple-500">ChakraChat</span> .
        </h3>
      </div>
    </ResizablePanel>
  );
};

export default EmptyChatContainer;
