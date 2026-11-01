import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import React from "react";
import Login from "../components/login";
import Signup from "../components/signup";

const AuthPage = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className="mt-36 flex flex-col items-center gap-10">
      <h1 className="text-5xl font-extrabold text-white">
        {searchParams.get("createNew")
          ? "Let's Login First..."
          : "Login / Signup"}
      </h1>

      <Tabs defaultValue="account" className="w-100">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Login">Login</TabsTrigger>
          <TabsTrigger value="Signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="Login"><Login /></TabsContent>
        <TabsContent value="Signup"><Signup /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;
