// api/chat.js

module.exports = async (req, res) => {
  // CORS headers for everything
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Just tell us what method Vercel thinks this is
  const info = {
    method: req.method,
    message: "Minimal debug handler is running"
  };

  // If preflight (OPTIONS), just say ok
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(info));
  }

  // For now: allow everything else too so we can see it works
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(info));
};
