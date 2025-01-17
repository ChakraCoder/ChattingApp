import { useAppSelector } from "@/app/hooks";

function Chat() {
  const user = useAppSelector((state) => state.user);
  console.log("user", user);

  return <div></div>;
}

export default Chat;
