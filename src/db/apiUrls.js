
import supabase from "./supabase";
import { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {
  if (!user_id) {
    throw new Error("User ID is required to load URLs");
  }

  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load URLs");
  }

  return data;
}

export async function deleteUrl(id) {
  if (!id) {
    throw new Error("URL ID is required to delete a URL");
  }

  const { error } = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to delete URL");
  }
  return true;
}

export async function createUrl(
  { title, longUrl, customUrl, shortUrl, user_id },
  qrcode,
) {
  if (!shortUrl) {
  throw new Error("Short URL code is required");
}

const short_url = shortUrl;
  const fileName = `qr-${short_url}`;
  const { error: storageError } = await supabase.storage
    .from("Qrs")
    .upload(fileName, qrcode);

  if (storageError) throw new Error(storageError.message);
  const qr = `${supabaseUrl}/storage/v1/object/public/Qrs/${fileName}`

  const { data, error } = await supabase.from("urls").insert([
    {
      title,
      original_url : longUrl,
      custom_url : customUrl || null,
      user_id,
      short_url,
      qr,
    },
  ]).select();

  if (error) {
    console.error(error.message);
    throw new Error("Error creating short URL");
  }
  return data;
}


export async function getLongUrl(id) {
  if (!id) {
    throw new Error("Short URL ID is required");
  }

  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .maybeSingle();

  if (error) {
    console.error(error.message);
    throw new Error("Error fetching short link");
  }
  if (!data) {
    throw new Error("Short link not found");
  }
  return data;
}

export async function getUrl({ id, user_id }) {
  if (!id || !user_id) {
    throw new Error("URL ID and User ID are required");
  }

  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("getUrl error:", error);
    throw error;
  }

  return data;
}
