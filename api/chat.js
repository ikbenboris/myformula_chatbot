export default async function handler(req, res) {
  // Debug log to see what’s actually being sent
  console.log("Incoming request:", {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight CORS
  if (req.method == "OPTIONS") {
    return res.status(200).end();
  }
  
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for this Shopify store. Answer only questions related to the store, its products, shipping and policies."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I could not generate a reply.";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("GPT error:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Server error" });
  }
}
