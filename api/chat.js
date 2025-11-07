
export default async function handler(req, res) {

  // Handle preflight
  if (req.method === "OPTIONS") {
    // Just say "OK" to the browser
    return res.status(200).end();
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    // Call OpenAI using your secret from env variable
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

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a reply.";

    // CORS: allow being called from your storefront
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("GPT error:", error);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    return res.status(500).json({ error: "Server error" });
  }
}