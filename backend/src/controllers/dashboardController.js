const pool = require("../config/db");

async function getDashboard(req, res, next) {
  try {
    const [totalRows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM crop_batches`
    );

    const [availableRows] = await pool.execute(
      `SELECT COALESCE(SUM(quantity), 0) AS total
       FROM crop_batches
       WHERE status = 'AVAILABLE'`
    );

    const [nearExpiryRows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM crop_batches
       WHERE status = 'AVAILABLE'
         AND expiry_date BETWEEN CURDATE()
         AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)`
    );

    const [distributedRows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM crop_batches
       WHERE status = 'DISTRIBUTED'`
    );

    res.json({
      success: true,
      data: {
        totalBatches: totalRows[0].total,
        availableQuantity: Number(
          availableRows[0].total
        ),
        nearExpiryBatches:
          nearExpiryRows[0].total,
        distributedBatches:
          distributedRows[0].total,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
};