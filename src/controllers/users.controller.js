const { constants: http } = require("http2");
const {
  findUserById,
  findAllUsers,
  deleteUser,
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
    },
  });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.listAllUsers = function (_req, res) {
  const users = findAllUsers();
  if (!users) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Data user tidak ditemukan",
    });
  }
  const usersRes = users.map((user) => {
    const { password, ...usersRes } = user;
    return usersRes;
  });

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "List all user",
    result: usersRes,
  });
};

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
