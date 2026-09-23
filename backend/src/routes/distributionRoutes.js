const express = require("express");

const distributionController = require(
  "../controllers/distributionController"
);

const router = express.Router();

router.get("/", distributionController.getHistory);

router.post(
  "/",
  distributionController.distributeCrop
);

module.exports = router;