const pool = require("../config/db");

const VALID_ROLES = [
  "ADMIN",
  "FARM_MANAGER",
  "DISTRIBUTOR",
];

const VALID_STATUSES = [
  "PENDING",
  "ACTIVE",
  "DISABLED",
];

async function getAllUsers() {
  const [rows] =
    await pool.execute(
      `
        SELECT
          id,
          name,
          email,
          role,
          status,
          created_at,
          updated_at
        FROM users
        ORDER BY created_at DESC
      `
    );

  return rows;
}

async function updateUser(
  id,
  {
    role,
    status,
  }
) {
  if (
    !VALID_ROLES.includes(role)
  ) {
    const error = new Error(
      "Invalid user role."
    );

    error.status = 400;
    throw error;
  }

  if (
    !VALID_STATUSES.includes(
      status
    )
  ) {
    const error = new Error(
      "Invalid account status."
    );

    error.status = 400;
    throw error;
  }

  const [result] =
    await pool.execute(
      `
        UPDATE users
        SET
          role = ?,
          status = ?
        WHERE id = ?
      `,
      [
        role,
        status,
        id,
      ]
    );

  if (
    result.affectedRows === 0
  ) {
    return null;
  }

  const [rows] =
    await pool.execute(
      `
        SELECT
          id,
          name,
          email,
          role,
          status,
          created_at,
          updated_at
        FROM users
        WHERE id = ?
      `,
      [id]
    );

  return rows[0];
}

async function deleteUser(id) {
  const [result] =
    await pool.execute(
      `
        DELETE FROM users
        WHERE id = ?
      `,
      [id]
    );

  return (
    result.affectedRows > 0
  );
}

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};