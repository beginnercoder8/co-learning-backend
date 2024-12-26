const jwt = require("jsonwebtoken");

const verifyJwtToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ code: 400, message: "Token is not provided" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({code: 400,message : 'Invalid or expired token'});
  }
};

module.exports = {
  verifyJwtToken
};
