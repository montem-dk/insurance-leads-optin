import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const API_VERSION = "v21.0";

function hash(value) {
  if (!value) return undefined;
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error("Missing META_PIXEL_ID or META_ACCESS_TOKEN env vars");
    return res.status(500).json({ error: "Tracking not configured" });
  }

  const { event_name, email, name, event_id, source_url, fbp, fbc } = req.body || {};

  if (!event_name) {
    return res.status(400).json({ error: "event_name is required" });
  }

  const user_data = {
    client_ip_address: req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.socket?.remoteAddress,
    client_user_agent: req.headers["user-agent"],
  };

  if (email) user_data.em = [hash(email)];
  if (name) user_data.fn = [hash(name.split(" ")[0])];
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;

  const event = {
    event_name,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: source_url || undefined,
    user_data,
  };

  // Event ID for deduplication with client-side pixel
  if (event_id) event.event_id = event_id;

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [event],
          access_token: ACCESS_TOKEN,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Meta CAPI error:", JSON.stringify(result));
      return res.status(response.status).json(result);
    }

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("Meta CAPI request failed:", err.message);
    return res.status(500).json({ error: "Failed to send event" });
  }
}
