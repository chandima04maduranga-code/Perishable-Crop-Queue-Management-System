const express = require("express");

const userController = require(
  "../controllers/userController"
);

const authenticate = require(
  "../middleware/authenticate"
);

const authorize = require(
  "../middleware/authorize"
);

const router = express.Router();

router.use(
  authenticate,
  authorize("ADMIN")
);

router.get(
  "/",
  userController.getUsers
);

router.patch(
  "/:id",
  userController.updateUser
);

router.delete(
  "/:id",
  userController.deleteUser
);

module.exports = router;