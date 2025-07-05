import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/ui/Login";
import SignUp from "@/components/ui/SignUp";
const Auth = () => {
  const [searchParams] = useSearchParams();
  return (
    <div className="mt-20 flex flex-col items-center gap-15">
      <h1 className="text-2xl sm:text-4xl font-bold">
        {searchParams.get("createNew") ? (
          <>
            <span className="rounded-sm px-2 py-1 bg-gradient-to-r from-primary-orange-tint via-primary-orange to-primary-orange-shade">
              Hold Up!
            </span>{" "}
            Let's Login First
          </>
        ) : (
          "Login / SignUp"
        )}
      </h1>
      <Tabs defaultValue="login" className="w-[400px] ">
        <TabsList className={"grid w-full grid-cols-2"}>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          {/* now we need to interact with the DB inorder to login, so lets create API's */}
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
