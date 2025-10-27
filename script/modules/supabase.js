import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "https://uncsznyfzbkqbxhrniae.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3N6bnlmemJrcWJ4aHJuaWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDkxOTksImV4cCI6MjA3NjMyNTE5OX0.r_mVVZ6oJ5vH3yjtdxGtOiczgFpmIVmUP9HxBlayiQE"
);
async function fetchImage(tag) {
  try {
    const { data, error } = await supabase.storage
      .from("images")
      .getPublicUrl(`profileP/${tag}`);

    if (error) throw error;
    return data.publicUrl; // 👈 this is your direct image URL
  } catch (error) {
    console.error("Error fetching image:", error.message);
  }
}

async function createImages(tag, pic) {
  try {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`profileP/${tag}`, pic, {
        cacheControl: "3600",
        upsert: true, //
      });

    if (error) throw error;

    alert("Picture Uploaded!");
    console.log("Upload data:", data);
    return data;
  } catch (err) {
    console.error("Upload failed:", err.message);
  }
}

export { createImages, fetchImage };
