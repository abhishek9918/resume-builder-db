const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;

function verifyToken(req, resp, next) {
  let token = req.headers["authorization"];
  if (!token) {
    return resp.status(403).send({
      success: false,
      message: "Please provide a token in the Authorization header",
    });
  }

  token = token.split(" ")[1];
  jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) {
      return resp.status(401).send({
        success: false,
        message: "Invalid or expired token",
        error: err.message,
      });
    }
    // req.decoded = decoded;
    req.user = decoded;

    next();
  });
}

module.exports = { verifyToken };
