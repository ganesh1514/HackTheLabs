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

export async function getSpecificUrl({ id: urlId, userId: user_id }) {
  try {
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("id", urlId)
      .eq("user_id", user_id)
      .single();

    if (error) {
      toast.error("Short URL not found: " + error.message);
      return null;
    }

    return data;
  } catch (error) {
    toast.error("Error fetching URL: " + error.message);
    return null;
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
  { title, original_url: longUrl, custom_url: customUrl, user_id },
  qrcode
) {
  try {
    const short_url = Math.random().toString(36).substring(2, 8);
    //* upload the qrcode
    let qrUrl = null;

    if (qrcode) {
      const fileName = `${Date.now()}_${short_url}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("qr-pictures")
        .upload(fileName, qrcode);

      if (uploadError) {
        toast.error(
          `${
            uploadError.message || "Failed to upload QR code, please try again."
          }`
        );
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("qr-pictures")
        .getPublicUrl(uploadData.path);
      qrUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("urls")
      .insert([
        {
          title,
          original_url: longUrl,
          custom_url: customUrl || null,
          user_id,
          short_url,
          qr: qrUrl || null,
        },
      ])
      .select();

    if (error) {
      toast.error(
        "Error creating short URL: " + "The Custom URL already exists."
      );
      return null;
    }
    return data;
  } catch (error) {
    toast.error("Error creating URL: " + error.message);
    return null;
  }
}

export async function getLongUrl({ url_id: id }) {
  try {
    const { data, error } = await supabase
      .from("urls")
      .select("id, original_url")
      .or(`short_url.eq.${id}, custom_url.eq.${id}`)
      .single();
    if (error) {
      toast.error("The URL does not exist, Redirecting to home page");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return null;
    }
    return data;
  } catch (error) {
    toast.error("The URL does not exist, Redirecting to home page");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
    return null;
  }
}
