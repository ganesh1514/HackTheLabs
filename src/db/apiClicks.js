import toast from "react-hot-toast";
import supabase from "./supabase";

export async function getClicks(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    toast.error("Error fetching clicks: " + error.message);
    return [];
  }

  if (!data) {
    toast.error("No clicks found for this user.");
    return [];
  }
  return data;
}
