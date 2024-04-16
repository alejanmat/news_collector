import Post from "../post.model";

/**
 * This function save new post in Mondgo
 *
 * @param Post channel
 * @returns the result of save
 */
const createPost = async (post: any): Promise<any> => {
  try {
    let newPost = await Post.findOne({ uuid: post.uuid });
    if (newPost) return;
    newPost = new Post({
      ...post,
    });
    console.log("save new post", newPost);
    return await newPost.save();
  } catch (err) {
    console.log(err);
  }
};
export { createPost };
