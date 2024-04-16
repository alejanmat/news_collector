const jwt = require("jsonwebtoken");

import type { Request, Response, NextFunction } from "express";
import Post from "./post.model";

const JWT_SECRET_KEY = "blablablabla";
/**
 * This function get new posts from mongodb
 *
 * @param req, res
 * @returns the posts based on a topic filter
 */
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topic = req.query?.topic;
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];
    const verified = jwt.verify(authToken, JWT_SECRET_KEY);
    if (topic && verified) {
      const posts = await Post.find({ topic });
      res.status(200).json({ message: "Ok", posts });
    } else {
      res.status(404).json({ message: "No topic specified" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
