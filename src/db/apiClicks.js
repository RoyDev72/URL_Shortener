import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

// Get clicks for multiple URLs
export async function getClicksForUrls(urlIds) {
  if (!Array.isArray(urlIds) || urlIds.length === 0) {
    throw new Error("getClicksForUrls: urlIds must be a non-empty array");
  }
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("Error fetching clicks:", error);
    return null;
  }

  return data;
}

// Get clicks for a single URL
export async function getClicksForUrl(url_id) {
  if (!url_id) {
    throw new Error("getClicksForUrl: url_id is required");
  }
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}

const parser = new UAParser();

// Store click and always redirect
export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop"; // Default to desktop if type is not detected

    const response = await fetch("https://ipapi.co/json/");
    const { city, country_name: country } = await response.json();

    // Record the click
    await supabase.from("clicks").insert([
      {
        url_id: id,
        city: city,
        country: country,
        device: device,
      },
    ]);
  } catch (error) {
    console.error("Error recording click:", error);
  } finally {
    // Always redirect, even if analytics fail
    if (originalUrl) {
      window.location.replace(originalUrl);
    }
  }
};