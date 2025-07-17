const { constants: http } = require("http2");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const {
  findUserById,
  // findAllUsers,
  findUserByEmail,
  createUser,
  deleteUser,
  updateUser,
} = require("../db/old/users.model");
const { User } = require("../models");
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.detailUser = async function (req, res) {
  const { id } = req.params;
  // const user = findUserById(id);
  const user = await User.findByPk(parseInt(id));
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

exports.listAllUsers = async function (req, res) {
  const search = req.query.search;
  const sort = req.query.sort;
  const page = req.query.page;
  // const users = findAllUsers(search, sorting, page);
  const users = await User.findAll();
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

exports.createUser = async function (req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Username, Email, dan password wajib diisi",
    });
  }

  try {
    const existsUser = await User.findOne({
      where: { email: email },
    });

    if (existsUser)
      return res.status(http.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Email sudah terdaftar",
      });

    const picture = req.file ? req.file.filename : null;
    const newUser = await User.create({
      username,
      email,
      password,
      picture,
    });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "User baru berhasil dibuat",
      result: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        picture: newUser.picture,
      },
    });
  } catch (error) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "User baru gagal dibuat.",
      error: error.message,
    });
  }
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

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.updateUser = async function (req, res) {
  const { id } = req.params;
  const updates = req.body;
  const picture = req.file;
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

  const updateResponse = {};

  if (updates.username) {
    user.username = updates.username;
    updateResponse.username = updates.username;
  }
  if (updates.email) {
    user.email = updates.email;
    updateResponse.email = updates.email;
  }
  if (updates.password) {
    user.password = updates.password;
  }
  if (picture) {
    const oldPicture = user.picture;
    if (oldPicture) {
      const oldPath = path.join("uploads", "profiles", oldPicture);
      try {
        await fsPromises.unlink(oldPath);
      } catch (err) {
        console.error("Gagal menghapus file lama:", err.message);
      }
    }
    user.picture = picture.filename;
    updateResponse.picture = picture.filename;
  }

  const userUpdate = updateUser(id, user);
  if (!userUpdate) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal mengupdate user",
    });
  }

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Update user berhasil",
    data: updateResponse,
  });
};

// test sequelize updateUser
// const updateUsers = await User.update;

// const deleteUser = await User.destroy({
//   where: {
//     id: parseInt(id),
//   },
//   returning: true,
// });
// return res.json({});
