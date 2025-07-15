const express = require("express");
const { constants: http } = require("http2");

const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use("/", require("./src/routers"));
app.get("/*spalt", (_req, res) => {
  return res.status(http.HTTP_STATUS_NOT_FOUND).json({
    success: false,
    message: "Not found",
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
