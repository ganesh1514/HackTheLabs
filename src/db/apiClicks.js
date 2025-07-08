import toast from "react-hot-toast";
import supabase from "./supabase";

export async function getClicks(urlIds) {
  try {
    const { data, error } = await supabase
      .from("clicks")
      .select("*")
      .in("url_id", urlIds);

    if (error) {
      toast.error("Error fetching clicks: " + error.message);
      return [];
    }

    if (!data || data.length === 0) {
      toast.error("No clicks found for this user.");
      return [];
    }
    return data;
  } catch (error) {
    toast.error("Network error: " + error.message);
    return [];
  }
}
