const { constants: http } = require("http2");
const { findUserByEmail, createUser } = require("../models/users.model");

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
