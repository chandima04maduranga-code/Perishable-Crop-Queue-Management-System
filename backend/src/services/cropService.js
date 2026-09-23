const pool = require("../config/db");

async function createCrop(data) {
  const {
    cropName,
    quantity,
    harvestDate,
    expiryDate,
    storageLocation,
  } = data;

  const [result] = await pool.execute(
    `INSERT INTO crop_batches
     (crop_name, quantity, harvest_date, expiry_date, storage_location)
     VALUES (?, ?, ?, ?, ?)`,
    [
      cropName,
      quantity,
      harvestDate,
      expiryDate,
      storageLocation,
    ]
  );

  return getCropById(result.insertId);
}

async function getAllCrops() {
  const [rows] = await pool.execute(
    `SELECT *
     FROM crop_batches
     ORDER BY harvest_date ASC, id ASC`
  );

  return rows;
}

async function getCropById(id) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM crop_batches
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function updateCrop(id, data) {
  const {
    cropName,
    quantity,
    harvestDate,
    expiryDate,
    storageLocation,
  } = data;

  const [result] = await pool.execute(
    `UPDATE crop_batches
     SET crop_name = ?,
         quantity = ?,
         harvest_date = ?,
         expiry_date = ?,
         storage_location = ?
     WHERE id = ?`,
    [
      cropName,
      quantity,
      harvestDate,
      expiryDate,
      storageLocation,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getCropById(id);
}

async function deleteCrop(id) {
  const [history] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM distributions
     WHERE crop_batch_id = ?`,
    [id]
  );

  if (history[0].total > 0) {
    const error = new Error(
      "A crop batch with distribution history cannot be deleted."
    );

    error.status = 400;
    throw error;
  }

  const [result] = await pool.execute(
    `DELETE FROM crop_batches WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
}

async function getNextCrop() {
  const [rows] = await pool.execute(
    `SELECT *
     FROM crop_batches
     WHERE status = 'AVAILABLE'
       AND quantity > 0
     ORDER BY harvest_date ASC, id ASC
     LIMIT 1`
  );

  return rows[0] || null;
}

module.exports = {
  createCrop,
  getAllCrops,
  getCropById,
  updateCrop,
  deleteCrop,
  getNextCrop,
};