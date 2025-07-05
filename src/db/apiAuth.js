import toast from "react-hot-toast";
import supabase from "./supabase";

export const gLogin = async ({ provider, source = "login" }) => {
  console.log("gLogin called with provider:", provider);
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?source=${source}`,
    },
  });

  if (error) {
    // throw new Error(error.message);
    toast.error(error.message);
    return;
  }

  return null;
};
export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // throw new Error(error.message);
    toast.error(error.message);
    return;
  }

  return data;
};

export const signUp = async ({ email, password, username, profilePicture }) => {
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
    return;
  }

  return data;
};
