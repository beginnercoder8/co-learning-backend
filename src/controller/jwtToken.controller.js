const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ code: 403, message: "Token is not provided." });
  } else {
    await jwt.verify(token,process.env.SECRET_KEY,(err, decoded) => {
        if(err){
            return res.status(401).json({code:401, message: err.message === 'jwt expired' ? 'Token expired' : err.message});
        }
        req.user = decoded;
        next();
    })
  }
};

module.exports = {
  verifyToken,
};
