import toast from "react-hot-toast";
import supabase from "./supabase";
import { UAParser } from "ua-parser-js";
import axios from "axios";

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
      return [];
    }
    return data;
  } catch (error) {
    toast.error("Network error: " + error.message);
    return [];
  }
}

export async function getSpecificUrlClicks({ id: urlId }) {
  try {
    const { data, error } = await supabase
      .from("clicks")
      .select("*")
      .eq("url_id", urlId);

    if (error) {
      toast.error("Unable to Load the Stats");
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }
    return data;
  } catch (error) {
    toast.error("Network error: " + error.message);
    return [];
  }
}

const parser = new UAParser();
export const storeClicks = async ({ id: urlId, originalUrl: longUrl }) => {
  try {
    const res = parser.getResult();
    const { city, country_name: country } = (
      await axios.get("https://ipapi.co/json/")
    ).data;
    // console.log("Location data:", { city, country });
    await supabase.from("clicks").insert({
      url_id: urlId,
      city: city,
      country: country,
      device: res.device.type || "desktop",
    });
    window.location.href = longUrl;
    toast.success("Redirecting to the original URL...");
  } catch (error) {
    // toast.error("Error storing clicks: " + error.message);
    toast.error("error recording clicks: " + error);
  }
};
