// api/chat.js

module.exports = async (req, res) => {
  // Altijd CORS headers zetten
  // Super simpele debug reactie
  const info = {
    method: req.method,
    message: "NEW DEBUG HANDLER IS RUNNING",
    version: "v3"
  };

  res.statusCode = 200;
  return res.end(JSON.stringify(info));
};
