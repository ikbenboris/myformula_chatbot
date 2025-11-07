// api/chat.js

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

module.exports = async function handler(req, res) {
  // Always set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // later you can restrict to your shop domain
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  // Only allow POST for real calls
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  // Read and parse JSON body manually (req.body is not auto parsed here)
  let bodyStr = "";
  for await (const chunk of req) {
    bodyStr += chunk;
  }

  let message;
  try {
    const body = JSON.parse(bodyStr || "{}");
    message = body.message;
  } catch (e) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Invalid JSON body" }));
  }

  if (!message) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Missing message" }));
  }

  try {
    // Call OpenAI
    const response = await fetch(OPENAI_URL, {
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
              "You are a helpful assistant for a Shopify store. Answer only questions related to the store, its products, ingredients, shipping, returns and usage."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a reply.";

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ reply }));
  } catch (err) {
    console.error("GPT error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Server error" }));
  }
};
