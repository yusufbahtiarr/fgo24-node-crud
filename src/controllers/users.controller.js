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
const { profile } = require("console");

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

exports.deleteUser = async function (req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(parseInt(id));
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Data user tidak tidak ditemukan",
      });
    }
    const deletedUser = await User.destroy({
      where: {
        id: parseInt(id),
      },
      returning: ["true"],
    });

    if (deletedUser === 0) {
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
        picture: user.picture,
      },
    });
  } catch (error) {
    return res.status(http.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat menghapus user.",
      error: error.message,
    });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.updateUser = async function (req, res) {
  const { id } = req.params;
  const picture = req.file;
  const fillable = ["username", "email", "password"];
  const newData = {};
  fillable.forEach((field) => {
    newData[field] = req.body[field];
  });

  if (Object.keys(newData).length === 0 && !picture) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Tidak ada data yang diupdate",
    });
  }

  try {
    const user = await User.findByPk(parseInt(id));
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Data user tidak ditemukan",
      });
    }

    if (profile) {
      if (user.picture) {
        const oldPath = path.join("uploads", "profiles", user.picture);
        try {
          await fsPromises.unlink(oldPath);
        } catch (error) {
          console.error("Gagal menghapus file lama:", error.message);
        }
      }
      newData.picture = picture.filename;
    }

    const updaterUser = User.update(newData, {
      where: {
        id: parseInt(id),
      },
      returning: true,
    });

    if (updateUser === 0) {
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Gagal mengupdate user",
      });
    }

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Update user berhasil",
      data: newData,
    });
  } catch (error) {}
};
