const pool = require("../config/db");

async function distributeCrop(quantity) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT *
       FROM crop_batches
       WHERE status = 'AVAILABLE'
         AND quantity > 0
       ORDER BY harvest_date ASC, id ASC
       LIMIT 1
       FOR UPDATE`
    );

    if (rows.length === 0) {
      const error = new Error(
        "No crop batches are available for distribution."
      );

      error.status = 404;
      throw error;
    }

    const crop = rows[0];

    const available = Number(crop.quantity);

    if (quantity > available) {
      const error = new Error(
        `Current FIFO batch contains only ${available} kg.`
      );

      error.status = 400;
      throw error;
    }

    const remaining = available - quantity;

    const status =
      remaining === 0
        ? "DISTRIBUTED"
        : "AVAILABLE";

    await connection.execute(
      `UPDATE crop_batches
       SET quantity = ?, status = ?
       WHERE id = ?`,
      [remaining, status, crop.id]
    );

    const [result] = await connection.execute(
      `INSERT INTO distributions
       (crop_batch_id, quantity)
       VALUES (?, ?)`,
      [crop.id, quantity]
    );

    await connection.commit();

    return {
      distributionId: result.insertId,
      cropBatchId: crop.id,
      cropName: crop.crop_name,
      distributedQuantity: quantity,
      remainingQuantity: remaining,
      status,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getHistory() {
  const [rows] = await pool.execute(
    `SELECT
        d.id,
        d.crop_batch_id,
        c.crop_name,
        d.quantity,
        d.distributed_at
     FROM distributions d
     INNER JOIN crop_batches c
       ON c.id = d.crop_batch_id
     ORDER BY d.distributed_at DESC, d.id DESC`
  );

  return rows;
}

module.exports = {
  distributeCrop,
  getHistory,
};