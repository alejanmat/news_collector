const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { connectToDB } = require("./services/db.service");
import { getPosts } from "./post.controller";
import { connectToChannel } from "./services/amqp.service";
app.use(cors());
app.use(bodyParser.json());
app.get("/posts", getPosts);

app.listen(4000, () => {
  connectToDB();
  connectToChannel();
  console.log("Listening on 4000");
});
