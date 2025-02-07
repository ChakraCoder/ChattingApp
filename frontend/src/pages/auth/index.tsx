import { useState, useEffect } from "react";
import Background from "@/assets/login.jpg";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoadingScreen from "@/common/LoadingScreen";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = Background;
    img.onload = () => setIsLoading(false);
  }, []);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <div className="min-h-screen w-full flex items-center justify-center overflow-y-auto">
      <div className="bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vh] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 pb-5">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <h1 className="text-5xl font-bold md:text-6xl">ChakraChat</h1>
            <p className="font-medium text-center">
              Fill in the Details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-black p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold  data-[state=active]:border-black p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col mt-10">
                <Login />
              </TabsContent>
              <TabsContent value="signup" className="flex flex-col">
                <Signup />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img
            src={Background}
            alt="background image"
            draggable="false"
            className="h-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
