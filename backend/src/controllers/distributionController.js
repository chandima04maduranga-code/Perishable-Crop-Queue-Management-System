const distributionService = require(
  "../services/distributionService"
);

async function distributeCrop(req, res, next) {
  try {
    const quantity = Number(req.body.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Distribution quantity must be greater than zero.",
      });
    }

    const result =
      await distributionService.distributeCrop(quantity);

    res.status(201).json({
      success: true,
      message:
        "Crop distributed successfully using FIFO.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const history =
      await distributionService.getHistory();

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  distributeCrop,
  getHistory,
};