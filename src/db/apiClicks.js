
import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load clicks");
  }

  return data;
}

export async function storeClicks({ id }) {
  try {
    const parser = new UAParser();
    const result = parser.getResult();

    const device =
      result.device.type === "mobile"
        ? "Mobile"
        : result.device.type === "tablet"
          ? "Tablet"
          : "Desktop";

    let city = null;
    let country = null;

    // Give the location service a maximum of 900 ms.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 900);

    try {
      const response = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
      });

      if (response.ok) {
        const location = await response.json();
        city = location.city || null;
        country = location.country_name || null;
      }
    } catch (error) {
      console.warn("Location lookup failed:", error.message);
    } finally {
      clearTimeout(timeout);
    }

    // Insert the click with its location.
    const { error } = await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    });

    if (error) {
      console.error("Click recording failed:", error.message);
    }
  } catch (error) {
    console.error("Error recording clicks:", error);
  }
}

export async function getClicksForUrl(url_id) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load stats");
  }

  return data;
}
