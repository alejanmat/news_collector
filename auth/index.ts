const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { randomBytes } = require("crypto");
const { accountVerify, login, logout } = require("./user.controller");
const { connectToDB } = require("./services/db.services");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/login", login);
app.get("/logout", logout);
app.post("/account-verify", accountVerify);

app.listen(4001, () => {
  connectToDB();
  console.log("Listening on 4001");
});
