import toast from "react-hot-toast";
import supabase from "./supabase";

export async function getUrls(user_id) {
  try {
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      toast.error("Error fetching URLs: " + error.message);
      return [];
    }

    return data || [];
  } catch (networkError) {
    toast.error("Network error: " + networkError.message);
    return [];
  }
}

export async function deleteUrl(urlId) {
  try {
    const { data, error } = await supabase
      .from("urls")
      .delete()
      .eq("id", urlId);
    if (error) {
      toast.error("Error deleting URL: " + error.message);
      return null;
    }
    return data;
  } catch (error) {
    toast.error("Error deleting URL: " + error.message);
    return null;
  }
}

export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrcode
) {
  try {
    const { data, error } = await supabase
      .from("urls")
      .insert([{ title, longUrl, customUrl, user_id, qrcode }]);
    if (error) {
      toast.error("Error creating URL: " + error.message);
      return null;
    }
    return data;
  } catch (error) {
    toast.error("Error creating URL: " + error.message);
    return null;
  }
}
