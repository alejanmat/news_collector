import mongoose from "mongoose";
const { Schema } = mongoose;
const PostsSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    created: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
    },
  },
  { timestamps: true, collection: "posts" }
);

export default mongoose.model("Post", PostsSchema);
