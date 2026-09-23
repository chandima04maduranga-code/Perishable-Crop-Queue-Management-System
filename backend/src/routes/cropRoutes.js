const express = require("express");
const cropController = require("../controllers/cropController");

const router = express.Router();

router.post("/", cropController.createCrop);
router.get("/", cropController.getAllCrops);

router.get("/next", cropController.getNextCrop);

router.get("/:id", cropController.getCropById);
router.put("/:id", cropController.updateCrop);
router.delete("/:id", cropController.deleteCrop);

module.exports = router;