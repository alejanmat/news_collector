const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const app = express();

import { start } from "./services/cron.service";

const posts = {};
app.use(cors());
app.use(bodyParser.json());

app.listen(4002, () => {
  start();
  console.log("Listening on 4002");
});
