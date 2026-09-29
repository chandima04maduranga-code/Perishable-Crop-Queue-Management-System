const authService = require(
  "../services/authService"
);

async function register(
  req,
  res,
  next
) {
  try {
    const {
      name,
      email,
      password,
      requestedRole,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !requestedRole
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and role are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });
    }

    const user =
      await authService.registerUser({
        name,
        email,
        password,
        requestedRole,
      });

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully. Wait for admin approval before logging in.",

      data: user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(
  req,
  res,
  next
) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const result =
      await authService.loginUser({
        email,
        password,
      });

    return res.json({
      success: true,
      message:
        "Login successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function me(
  req,
  res
) {
  return res.json({
    success: true,
    data: req.user,
  });
}

module.exports = {
  register,
  login,
  me,
};