const express = require("express");

const cropController = require(
  "../controllers/cropController"
);

const authenticate = require(
  "../middleware/authenticate"
);

const authorize = require(
  "../middleware/authorize"
);

const router = express.Router();


// PUBLIC
router.get(
  "/",
  cropController.getAllCrops
);

router.get(
  "/next",
  cropController.getNextCrop
);

router.get(
  "/:id",
  cropController.getCropById
);


// FARM MANAGER / ADMIN
router.post(
  "/",
  authenticate,
  authorize(
    "ADMIN",
    "FARM_MANAGER"
  ),
  cropController.createCrop
);

router.put(
  "/:id",
  authenticate,
  authorize(
    "ADMIN",
    "FARM_MANAGER"
  ),
  cropController.updateCrop
);

router.delete(
  "/:id",
  authenticate,
  authorize(
    "ADMIN",
    "FARM_MANAGER"
  ),
  cropController.deleteCrop
);

module.exports = router;