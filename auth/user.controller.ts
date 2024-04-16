const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import type { Request, Response, NextFunction } from "express";
import User from "./user.model";

const JWT_SECRET_KEY = "blablablabla";

const BCRYPT_SALT = "thisissalt";

/**
 * This function create a new user
 *
 * @param
 * @returns the result of user creation
 */
const _addUser = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (user) return;
  const newUser = new User({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: bcrypt.hashSync(data.password, Number(BCRYPT_SALT)),
  });
  await newUser.save();
};

/**
 * This function manage the login
 *
 * @param
 * @returns a new token
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("User not found."));
    console.log(user);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return next(new Error("Wrong email or password."));

    jwt.sign(
      { user },
      JWT_SECRET_KEY,
      {
        expiresIn: 31556926, // 1 year in seconds
      },
      (err, token) => {
        res.status(200).json({ message: "success", token });
      }
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * This function verify if the user has a valid authToken
 *
 * @param req, res, next
 * @returns the response
 */
export const accountVerify = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeaderKey = "jwt-token";
  const authToken = req.headers[tokenHeaderKey];
  try {
    const verified = jwt.verify(authToken, JWT_SECRET_KEY);
    if (verified) {
      return res.status(200).json({ status: "logged in", message: "success" });
    } else {
      return res.status(401).json({ status: "invalid auth", message: "error" });
    }
  } catch (error) {
    return res.status(401).json({ status: "invalid auth", message: "error" });
  }
};

/**
 * This function manage the logout
 *
 * @param
 * @returns a new token
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      message: "logout success",
    });
  } catch (err) {
    next(err);
  }
};

_addUser({
  firstName: "Jhon",
  lastName: "Doe",
  password: "test",
  email: "jhon.doe@gmail.com",
});
