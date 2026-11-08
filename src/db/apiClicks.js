import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

        if (error) {
            console.error(error.message);
            throw new Error("Unable to load CLicks")
        };


  return data;
}

const parser = new UAParser();

export async function storeClicks({ id, originalUrl: original_url }){
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";

    let city = null;
    let country = null;
    try {
      const response = await fetch("https://ipapi.co/json");
      if (response.ok) {
        const location = await response.json();
        city = location.city || null;
        country = location.country_name || null;
      }
    } catch (error) {
      console.warn("Unable to load redirect location:", error);
    }

    await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    });
  } catch (error) {
    console.error("Error recording clicks:", error);
  } finally {
    if (original_url) window.location.href = original_url;
  }
}

export async function getClicksForUrl(url_id) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id",url_id)

  if (error) {
    console.error(error.message);
    throw new Error("Uable to load Stats");
  }
  return data;
}