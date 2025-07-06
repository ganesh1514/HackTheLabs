import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/db/supabase";
import { toast } from "react-hot-toast";

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log("Auth state changed:", event, session?.user?.email);

      setSession(session);
      setUser(session?.user || null);
      setLoading(false);

      // if (event === "SIGNED_IN") {
      //   // console.log("User signed in:", session?.user?.email);
      // } else
      if (event === "SIGNED_OUT") {
        // console.log("User signed out");
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
        return;
      }
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message || "Error signing out");
    } finally {
      setLoading(false);
    }
  };

  // Get user profile data
  const getUserProfile = () => {
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name:
        user.user_metadata?.username ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0],
      username: user.user_metadata?.username,
      profilePicture:
        user.user_metadata?.profilePicture || user.user_metadata?.avatar_url,
      provider: user.app_metadata?.provider || "email",
      createdAt: user.created_at,
    };
  };

  const value = {
    user,
    session,
    loading,
    logout,
    getUserProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
