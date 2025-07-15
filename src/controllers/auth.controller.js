const { constants: http } = require("http2");
const {
  findUserByEmail,
  createUser,
  updatePassword,
} = require("../models/users.model");
const { saveOTP, verifyOTP } = require("../models/auth.model");

/**
 *
 * @param { import("express").Request} req
 * @param { import("express").Response} res
 * @returns
 */

exports.login = function (req, res) {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email dan password diwajib diisi",
    });
  }

  const userLogin = findUserByEmail(email);
  console.log(userLogin);

  if (!userLogin || userLogin.password !== password) {
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Email atau password salah.",
    });
  }
  return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Login berhasil",
    results: {
      id: userLogin.id,
      username: userLogin.username,
      email: userLogin.email,
    },
  });
};

/**
 *
 * @param { import("express").Request} req
 * @param { import("express").Response} res
 * @returns
 */

exports.register = function (req, res) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Username, email, dan password wajib diisi",
    });
  }

  const userLogin = findUserByEmail(email);
  if (userLogin) {
    return res.status(http.HTTP_STATUS_CONFLICT).json({
      success: true,
      message: "Email sudah terdaftar",
    });
  }

  const newUser = createUser({ username, email, password });
  return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Registrasi user berhasil",
    result: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
  });
};

/**
 *
 * @param { import("express").Request} req
 * @param { import("express").Response} res
 * @returns
 */

exports.forgotPassword = function (req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email tidak boleh kosong",
    });
  }
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Email tidak terdaftar",
    });
  }

  const otpUser = saveOTP(user.id);
  if (!otpUser) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal melakukan forgot password",
    });
  }

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message:
      "Berhasil melakukan forgot password. Gunakan otp ini untuk melakukan reset password",
    data: "OTP: " + otpUser.otp,
  });
};

exports.resetPassword = function (req, res) {
  const { otp, new_password, confirm_password } = req.body;
  if (!otp && !new_password && !confirm_password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Otp, new password dan confirm password tidak boleh kosong",
    });
  }
  if (new_password !== confirm_password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "new password dan confirm password tidak sama",
    });
  }
  const userId = verifyOTP(otp);
  if (!userId) {
    res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "OTP tidak valid",
    });
  }

  const user = updatePassword(userId, new_password);
  if (!user) {
    res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal melakukan reset password",
    });
  }

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Reset password berhasil",
  });
};
