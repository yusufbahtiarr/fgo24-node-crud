const { constants: http } = require("http2");
const {
  findUserById,
  findAllUsers,
  findUserByEmail,
  createUser,
  deleteUser,
  updateUser,
} = require("../models/users.model");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.detailUser = function (req, res) {
  const { id } = req.params;
  const user = findUserById(id);
  if (!user) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Data user tidak ditemukan",
    });
  }

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Detail user",
    results: {
      id: user.id,
      username: user.username,
      email: user.email,
      picture: user.picture,
    },
  });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.listAllUsers = function (req, res) {
  const search = req.query.search;
  const sorting = req.query.sort;
  const page = req.query.page;
  const users = findAllUsers(search, sorting, page);
  if (!users) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Data user tidak ditemukan",
    });
  }

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "List all user",
    result: users,
  });
};

/**
 *
 * @param { import("express").Request} req
 * @param { import("express").Response} res
 * @returns
 */

exports.createUser = function (req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Username, Email, dan password wajib diisi",
    });
  }

  const userLogin = findUserByEmail(email);
  if (userLogin) {
    return res.status(http.HTTP_STATUS_CONFLICT).json({
      success: true,
      message: "Email sudah terdaftar",
    });
  }

  const picture = req.file ? req.file.filename : null;
  const newUser = createUser({ username, email, password, picture });
  console.log("newuser", newUser);

  return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Create user berhasil",
    result: {
      id: newUser.id,
      email: newUser.email,
      picture: newUser.picture,
    },
  });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.deleteUser = function (req, res) {
  const { id } = req.params;
  const user = findUserById(id);
  if (!user) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Data user tidak tidak ditemukan",
    });
  }

  const del = deleteUser(id);
  if (!del) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal menghapus user",
    });
  }
  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "data user berhasil di hapus",
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.updateUser = function (req, res) {
  const { id } = req.params;
  const updates = req.body;
  const picture = req.file ? req.file.filename : null;
  if (!updates.email && !updates.username && !updates.password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Username, email, atau password tidak ada yang terisi",
    });
  }
  const user = findUserById(id);
  if (!user) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Data user tidak ditemukan",
    });
  }

  const userUpdate = updateUser(id, updates, picture);
  if (!userUpdate) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal mengupdate user",
    });
  }
  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Update user berhasil",
    data: updates,
  });
};
