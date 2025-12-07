import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "~/middleware/AuthMiddleware";
import UserModel from "~/models/users";

const setToken = (res: Response, username: string, userId: string) => {
  const token = jwt.sign({ userId: userId, user: username }, JWT_SECRET!, {
    expiresIn: "2h",
  });
  return res.setHeader("Authorization", `Bearer ${token}`);
};

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}
export const registerHandler = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as RegisterRequestBody;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if user already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Verify save and set token
    if (!newUser._id) {
      throw new Error();
    }

    setToken(res, username, newUser._id.toString());
    return res.status(200).json({ message: "User registered successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to register" });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  console.log(req.body);
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    setToken(res, username, user._id.toString());
    return res.status(200).json({ message: "Login successful" });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to login" });
  }
};
