const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function authenticate(
  req,
  res,
  next
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const token =
      authHeader.substring(7);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const [rows] =
      await pool.execute(
        `
          SELECT
            id,
            name,
            email,
            role,
            status
          FROM users
          WHERE id = ?
          LIMIT 1
        `,
        [decoded.id]
      );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "User account not found.",
      });
    }

    const user = rows[0];

    if (
      user.status !== "ACTIVE"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This account is not active.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired login session.",
    });
  }
}

module.exports = authenticate;