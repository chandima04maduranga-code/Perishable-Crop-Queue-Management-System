require("dotenv").config();

const bcrypt = require(
  "bcryptjs"
);

const pool = require(
  "../src/config/db"
);

async function seedAdmin() {
  try {
    const {
      ADMIN_NAME,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
    } = process.env;

    if (
      !ADMIN_NAME ||
      !ADMIN_EMAIL ||
      !ADMIN_PASSWORD
    ) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );
    }

    const passwordHash =
      await bcrypt.hash(
        ADMIN_PASSWORD,
        12
      );

    await pool.execute(
      `
        INSERT INTO users
        (
          name,
          email,
          password_hash,
          role,
          status
        )
        VALUES (
          ?,
          ?,
          ?,
          'ADMIN',
          'ACTIVE'
        )

        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          password_hash =
            VALUES(password_hash),
          role = 'ADMIN',
          status = 'ACTIVE'
      `,
      [
        ADMIN_NAME,
        ADMIN_EMAIL
          .trim()
          .toLowerCase(),
        passwordHash,
      ]
    );

    console.log(
      "Admin account created successfully."
    );
  } catch (error) {
    console.error(
      error.message
    );
  } finally {
    await pool.end();
  }
}

seedAdmin();