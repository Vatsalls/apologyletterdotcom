import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("⚠️  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const PHOTOS_BUCKET = "photos";

// ---- helpers ----
function base64ToBuffer(dataUrl: string): { buffer: Buffer; contentType: string; ext: string } {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    // Not a data URL (already a hosted URL) — caller should handle this case separately
    throw new Error("Not a base64 data URL");
  }
  const contentType = match[1];
  const ext = contentType.split("/")[1] || "jpg";
  const buffer = Buffer.from(match[2], "base64");
  return { buffer, contentType, ext };
}

// Track visits
app.post("/api/visit", async (req, res) => {
  try {
    const now = new Date().toISOString();
    const userAgent = String(req.headers["user-agent"] || "Unknown Browser").slice(0, 80);

    const { data: state } = await supabase.from("app_state").select("visitor_count").eq("id", 1).single();
    const newCount = (state?.visitor_count || 0) + 1;

    await supabase.from("app_state").update({ visitor_count: newCount, last_visit: now }).eq("id", 1);
    await supabase.from("visitors").insert({ time: now, user_agent: userAgent });

    // trim visitors to last 50
    const { data: allVisitors } = await supabase
      .from("visitors")
      .select("id")
      .order("time", { ascending: false });
    if (allVisitors && allVisitors.length > 50) {
      const idsToDelete = allVisitors.slice(50).map((v) => v.id);
      await supabase.from("visitors").delete().in("id", idsToDelete);
    }

    res.json({ success: true, count: newCount });
  } catch (err) {
    console.error("visit error:", err);
    res.status(500).json({ error: "Failed to log visit" });
  }
});

// Save a note (kept privately, viewable only from the settings panel)
app.post("/api/send-message", async (req, res) => {
  const { senderName, message, mood } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message content cannot be empty!" });
  }

  const newMessage = {
    id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    sender_name: senderName || "Your Name",
    message: message.trim(),
    mood: mood || "",
    timestamp: new Date().toISOString(),
    read: false,
  };

  const { error } = await supabase.from("messages").insert(newMessage);
  if (error) {
    console.error("send-message error:", error);
    return res.status(500).json({ error: "Failed to save message" });
  }

  res.json({
    success: true,
    message: "Your message has been saved! ",
    data: newMessage,
  });
});

// Get admin stats & messages (for the hidden settings panel)
app.get("/api/admin/data", async (req, res) => {
  try {
    const { data: state } = await supabase.from("app_state").select("*").eq("id", 1).single();
    const { data: visitors } = await supabase
      .from("visitors")
      .select("time, user_agent")
      .order("time", { ascending: false })
      .limit(50);
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .order("timestamp", { ascending: false });

    res.json({
      visitorCount: state?.visitor_count || 0,
      lastVisit: state?.last_visit || null,
      visitors: (visitors || []).map((v) => ({ time: v.time, userAgent: v.user_agent })),
      messages: (messages || []).map((m) => ({
        id: m.id,
        senderName: m.sender_name,
        message: m.message,
        mood: m.mood,
        timestamp: m.timestamp,
        read: m.read,
      })),
      customLetter: state?.custom_letter || "",
    });
  } catch (err) {
    console.error("admin/data error:", err);
    res.status(500).json({ error: "Failed to load admin data" });
  }
});

// Save custom landing letter
app.post("/api/admin/update-letter", async (req, res) => {
  const { letter } = req.body;
  if (typeof letter === "string") {
    await supabase.from("app_state").update({ custom_letter: letter }).eq("id", 1);
  }
  const { data: state } = await supabase.from("app_state").select("custom_letter").eq("id", 1).single();
  res.json({ success: true, letter: state?.custom_letter || "" });
});

// List photos
app.get("/api/photos", async (req, res) => {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("get photos error:", error);
    return res.status(500).json({ error: "Failed to load photos" });
  }

  res.json({
    photos: (data || []).map((p) => ({
      id: p.id,
      url: p.url,
      caption: p.caption,
      date: p.date,
      frameStyle: p.frame_style,
      sticker: p.sticker,
      likes: p.likes,
    })),
  });
});

// Add a photo (uploads image to Supabase Storage, stores public URL in DB)
app.post("/api/photos", async (req, res) => {
  const { url, caption, frameStyle, sticker, date } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Photo URL/data is required" });
  }

  const id = "photo-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
  let finalUrl = url;

  try {
    if (typeof url === "string" && url.startsWith("data:image/")) {
      const { buffer, contentType, ext } = base64ToBuffer(url);
      const filename = `${id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(PHOTOS_BUCKET)
        .upload(filename, buffer, { contentType, upsert: false });

      if (uploadError) {
        console.error("storage upload error:", uploadError);
        return res.status(500).json({ error: "Failed to upload image" });
      }

      const { data: publicUrlData } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(filename);
      finalUrl = publicUrlData.publicUrl;
    }

    const newPhoto = {
      id,
      url: finalUrl,
     
     
      frame_style: frameStyle || "polaroid",
      sticker: sticker || "",
   
    };

    const { error: insertError } = await supabase.from("photos").insert(newPhoto);
    if (insertError) {
      console.error("insert photo error:", insertError);
      return res.status(500).json({ error: "Failed to save photo" });
    }

    res.json({
      success: true,
      photo: {
        id: newPhoto.id,
        url: newPhoto.url,
        caption: newPhoto.caption,
        date: newPhoto.date,
        frameStyle: newPhoto.frame_style,
        sticker: newPhoto.sticker,
        likes: newPhoto.likes,
      },
    });
  } catch (err) {
    console.error("add photo error:", err);
    res.status(500).json({ error: "Failed to process photo" });
  }
});

// Delete a photo (from the settings panel)
app.delete("/api/photos/:id", async (req, res) => {
  const id = req.params.id;

  const { data: photo } = await supabase.from("photos").select("url").eq("id", id).single();
  if (photo?.url) {
    const match = photo.url.match(/\/photos\/([^/?]+)$/);
    if (match) {
      await supabase.storage.from(PHOTOS_BUCKET).remove([match[1]]);
    }
  }

  await supabase.from("photos").delete().eq("id", id);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(` App running on http://localhost:${PORT}`);
  });
}

startServer();
