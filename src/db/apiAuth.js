import toast from "react-hot-toast";
import supabase from "./supabase";

export const gLogin = async ({ provider, source = "login" }) => {
  try {
    const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

    //* get the current url papraeteres to preserve them
    const currentParams = new URLSearchParams(window.location.search);
    const createNew = currentParams.get("createNew");
    const redirectTo = currentParams.get("redirect");

    //* this is call back url
    let redirectUrl = `${baseUrl}/auth/callback?source=${source}`;

    //* preserve urls;

    if (createNew) {
      redirectUrl += `&createNew=${encodeURIComponent(createNew)}`;
    }
    if (redirectTo) {
      redirectUrl += `&redirect=${encodeURIComponent(redirectTo)}`;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      // throw new Error(error.message);
      toast.error(error.message);
      return;
    }
  } catch (error) {
    // Handle network errors
    toast.error("Error logging in " + error.message);
    return;
  }
};
export const login = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // throw new Error(error.message);
      toast.error(error.message);
      return null;
    }

    return data;
  } catch (err) {
    toast.error("Error Logging in: " + err.message);
    return null;
  }
};

export const signUp = async ({ email, password, username, profilePicture }) => {
  try {
    let profilePictureUrl = null;

    // only upload file if profilePicture is provided
    if (profilePicture) {
      const fileName = `${Date.now()}_${profilePicture.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, profilePicture);

      if (uploadError) {
        // throw new Error(uploadError.message);
        toast.error(
          `${
            uploadError.message ||
            "Failed to upload profile picture, please try again."
          }`
        );
        return;
      }
      const { data: urlData } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(uploadData.path);
      profilePictureUrl = urlData.publicUrl;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          profilePicture: profilePictureUrl,
        },
      },
    });

    if (error) {
      // throw new Error(error.message);
      toast.error(error.message);
      return null;
    }

    return data;
  } catch (err) {
    toast.error("Error Signing Up " + err.message);
    return null;
  }
};

export const resetPassword = async ({ email }) => {
  try {
    const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const redirectUrl = `${baseUrl}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset email sent! Check your inbox.");
    return true;
  } catch (err) {
    toast.error("Error while Resetting the password: " + err.message);
    return null;
  }
};

export const updatePassword = async ({ password }) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error(error.message);
      return null;
    }


    return true;
  } catch (err) {
    toast.error("Error while updating the password: " + err.message);
    return null;
  }
};
