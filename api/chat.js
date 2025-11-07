// api/chat.js

module.exports = async (req, res) => {
  // Altijd CORS headers zetten
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Super simpele debug reactie
  const info = {
    method: req.method,
    message: "NEW DEBUG HANDLER IS RUNNING",
    version: "v3"
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(info));
};
