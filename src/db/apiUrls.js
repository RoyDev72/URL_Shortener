import { UAParser } from "ua-parser-js";
import supabase from "./supabase";
import { supabaseUrl } from "./supabase";

// get all urls for a user


export async function getUrls(user_id) {
  const {data, error} = await supabase
  .from("urls")
  .select("*")
  .eq("user_id", user_id)

  if (error) {
    console.error("Unable to load URLs:", error);
    throw new Error(error.message);
  }
  return data;
}

// delete url by id
export async function deleteUrl(id) {
  const {data, error} = await supabase
  .from("urls")
  .delete()
  .eq("id", id)

  if (error) {
    console.error("Unable to delete URL");
    throw new Error(error.message);
  }
  return data;
}

export async function createUrl({title, longUrl, customUrl, user_id}, qrcode) {
  const short_url = Math.random().toString(36).substring(2, 6);
  const fileName = `qr-${short_url}`;

  const {error: storageError} = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const {data, error} = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating short URL");
  }

  return data;
}

export async function getLongUrl(id) {
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error) {
    // Only throw if it's not a "no rows found" error
    if (error.code !== "PGRST116") {
      console.error(error.message);
      throw new Error("Error fetching short link");
    }
    // If not found, return null
    return null;
  }
  return data;
}

const parser = new UAParser();

export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";

    const response = await fetch("https://ipapi.co/json/");
    const { city, country_name: country } = await response.json();

    await supabase.from("clicks").insert([
      {
        url_id: id,
        city: city,
        country: country,
        device: device,
      },
    ]);

    // redirect to original URL
    window.location.href = originalUrl;

  } catch (error) {
    console.error("Error storing click data:", error);
  }
};


// get url by id and user_id
export async function getUrl({ id, user_id }) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found, return null instead of throwing
      return null;
    }
    throw new Error(error.message);
  }
  return data;
}
