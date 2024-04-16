const mongoose = require("mongoose");
const MONGO_URL = "mongodb+srv://testArea:testArea@atlascluster.djarg4c.mongodb.net/";

const connectToDB = async () => {
  mongoose.set("strictQuery", false);
  try {
    mongoose.connect(MONGO_URL);
    console.log("connect to database");
  } catch (error) {
    throw error;
  }

  mongoose.connection.on("disconnected", () => {
    console.log("DB disconnected");
  });

  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });
};

export { connectToDB };
