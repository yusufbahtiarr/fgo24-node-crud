const routers = require("express").Router();

routers.use("/auth", require("./auth.router"));
routers.use("/users", require("./users.router"));

module.exports = routers;
