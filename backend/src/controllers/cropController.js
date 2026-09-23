const cropService = require("../services/cropService");

function validateCrop(data) {
  const {
    cropName,
    quantity,
    harvestDate,
    expiryDate,
    storageLocation,
  } = data;

  if (
    !cropName?.trim() ||
    quantity === undefined ||
    !harvestDate ||
    !expiryDate ||
    !storageLocation?.trim()
  ) {
    return "All crop fields are required.";
  }

  const numericQuantity = Number(quantity);

  if (
    !Number.isFinite(numericQuantity) ||
    numericQuantity <= 0
  ) {
    return "Quantity must be greater than zero.";
  }

  if (new Date(expiryDate) < new Date(harvestDate)) {
    return "Expiry date cannot be before harvest date.";
  }

  return null;
}

async function createCrop(req, res, next) {
  try {
    const validation = validateCrop(req.body);

    if (validation) {
      return res.status(400).json({
        success: false,
        message: validation,
      });
    }

    const crop = await cropService.createCrop(req.body);

    res.status(201).json({
      success: true,
      message: "Crop batch created successfully.",
      data: crop,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllCrops(req, res, next) {
  try {
    const crops = await cropService.getAllCrops();

    res.json({
      success: true,
      data: crops,
    });
  } catch (error) {
    next(error);
  }
}

async function getCropById(req, res, next) {
  try {
    const crop = await cropService.getCropById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop batch not found.",
      });
    }

    res.json({
      success: true,
      data: crop,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCrop(req, res, next) {
  try {
    const validation = validateCrop(req.body);

    if (validation) {
      return res.status(400).json({
        success: false,
        message: validation,
      });
    }

    const crop = await cropService.updateCrop(
      req.params.id,
      req.body
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop batch not found.",
      });
    }

    res.json({
      success: true,
      message: "Crop batch updated successfully.",
      data: crop,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteCrop(req, res, next) {
  try {
    const deleted = await cropService.deleteCrop(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Crop batch not found.",
      });
    }

    res.json({
      success: true,
      message: "Crop batch deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

async function getNextCrop(req, res, next) {
  try {
    const crop = await cropService.getNextCrop();

    res.json({
      success: true,
      data: crop,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCrop,
  getAllCrops,
  getCropById,
  updateCrop,
  deleteCrop,
  getNextCrop,
};