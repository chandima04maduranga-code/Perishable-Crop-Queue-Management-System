const express = require("express");

const distributionController =
  require(
    "../controllers/distributionController"
  );

const authenticate = require(
  "../middleware/authenticate"
);

const authorize = require(
  "../middleware/authorize"
);

const router = express.Router();


// Logged-in users can see history
router.get(
  "/",
  authenticate,
  distributionController.getHistory
);


// Distributor or Admin can distribute
router.post(
  "/",
  authenticate,
  authorize(
    "ADMIN",
    "DISTRIBUTOR"
  ),
  distributionController.distributeCrop
);

module.exports = router;