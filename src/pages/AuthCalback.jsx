import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "@/db/supabase";
import { toast } from "react-hot-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");
  const source = searchParams.get("source");

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        toast.error("Authentication failed. Please try again.");
        navigate("/auth");
        return;
      }

      if (session) {
        const user = session.user;

        //* check if user is new ( created within last 5 seconds )
        const isNewUser =
          new Date(user.created_at) > new Date(Date.now() - 5000);
        if (source === "login" && isNewUser) {
          //* user click "login with google"  but is actually a new user
          toast.error("You are a new user. Please sign up first.");
          //* Log them out since they-re new but tried to  log in
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        if (source === "signup" && !isNewUser) {
          //* user click "sign up with google" but is actually an existing user
          toast.error(
            "Account already exists, You have been logged in instead."
          );
          navigate(`/dashboard${longUrl ? `?createNew=${longUrl}` : ""}`);
          return;
        }

        //* show appropriate success message
        if (isNewUser) {
          toast.success("Account Created Successfully, Welcome!🙏");
        } else {
          toast.success("Logged in Successfully, Welcome back!🙏");
        }
        navigate(`/dashboard${longUrl ? `?createNew=${longUrl}` : ""}`);
      } else {
        toast.error("No active session found. Please log in.");
        navigate("/auth");
      }
    };
    getSession();
  }, [navigate, longUrl, source]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-white">Completing authentication...</p>
      </div>
    </div>
  );
};
export default AuthCallback;
