const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const ALLOWED_PUBLIC_ROLES = [
  "FARM_MANAGER",
  "DISTRIBUTOR",
];

async function registerUser({
  name,
  email,
  password,
  requestedRole,
}) {
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const [existing] = await pool.execute(
    `
      SELECT id
      FROM users
      WHERE email = ?
    `,
    [normalizedEmail]
  );

  if (existing.length > 0) {
    const error = new Error(
      "An account already exists with this email."
    );

    error.status = 409;
    throw error;
  }

  if (
    !ALLOWED_PUBLIC_ROLES.includes(
      requestedRole
    )
  ) {
    const error = new Error(
      "Invalid account role."
    );

    error.status = 400;
    throw error;
  }

  const passwordHash =
    await bcrypt.hash(password, 12);

  const [result] = await pool.execute(
    `
      INSERT INTO users
      (
        name,
        email,
        password_hash,
        role,
        status
      )
      VALUES (?, ?, ?, ?, 'PENDING')
    `,
    [
      name.trim(),
      normalizedEmail,
      passwordHash,
      requestedRole,
    ]
  );

  return {
    id: result.insertId,
    name: name.trim(),
    email: normalizedEmail,
    role: requestedRole,
    status: "PENDING",
  };
}

async function loginUser({
  email,
  password,
}) {
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const [rows] = await pool.execute(
    `
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        status
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [normalizedEmail]
  );

  if (rows.length === 0) {
    const error = new Error(
      "Invalid email or password."
    );

    error.status = 401;
    throw error;
  }

  const user = rows[0];

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!passwordMatches) {
    const error = new Error(
      "Invalid email or password."
    );

    error.status = 401;
    throw error;
  }

  if (user.status === "PENDING") {
    const error = new Error(
      "Your account is waiting for admin approval."
    );

    error.status = 403;
    throw error;
  }

  if (user.status === "DISABLED") {
    const error = new Error(
      "Your account has been disabled."
    );

    error.status = 403;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        "8h",
    }
  );

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};