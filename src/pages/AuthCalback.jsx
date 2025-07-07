import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "@/db/supabase";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");
  const source = searchParams.get("source");
  const redirectTo = searchParams.get("redirect");

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

        const userName =
          user.user_metadata?.username ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "";
        //* show appropriate success message
        if (isNewUser) {
          toast.success(
            `Account Created Successfully, Welcome! ${userName} 🙏`
          );
        } else {
          toast.success(`Logged in Successfully, Welcome back! ${userName} 🙏`);
        }
        if (redirectTo) {
          navigate(decodeURIComponent(redirectTo));
        } else {
          navigate(`/dashboard${longUrl ? `?createNew=${longUrl}` : ""}`);
        }
      } else {
        toast.error("No active session found. Please log in.");
        navigate("/auth");
      }
    };
    getSession();
  }, [navigate, longUrl, source, redirectTo]);
  return <LoadingSpinner message="Completing authentication..." />;
};
export default AuthCallback;
