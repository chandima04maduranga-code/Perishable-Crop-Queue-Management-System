const userService = require(
  "../services/userService"
);

async function getUsers(
  req,
  res,
  next
) {
  try {
    const users =
      await userService
        .getAllUsers();

    return res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(
  req,
  res,
  next
) {
  try {
    const targetId =
      Number(req.params.id);

    if (
      req.user.id === targetId &&
      req.body.status !==
        "ACTIVE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot disable your own admin account.",
      });
    }

    const user =
      await userService.updateUser(
        targetId,
        {
          role: req.body.role,
          status:
            req.body.status,
        }
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "User account updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(
  req,
  res,
  next
) {
  try {
    const targetId =
      Number(req.params.id);

    if (
      req.user.id === targetId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own admin account.",
      });
    }

    const deleted =
      await userService.deleteUser(
        targetId
      );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "User account deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
};