import __Account, { IAccount } from "../models/account.js";
import { Request, Response } from "express";

export interface CustomRequest extends Request {
    user?: IAccount;
  }
class UserService {
    // Create a new user
    async createUser(req:Request, res:Response) {
      try {
        const userData= req.body
        const user = new __Account(userData);
        await user.save();
        res.status(201).json(user);
      } catch (error) {
        res.status(400).send({success:false, message:`Error creating user: ${(error as Error).message}`});
      }
    }
  

// User Login
  async loginUser(req:Request, res:Response) {
    try {
        const {email, password} = req.body
      const user:IAccount = await __Account.findOne({ email });
      if (!user) res.status(400).send({success:false, message:"Invalid email or password"});

      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error("Invalid email or password");

      const token = user.generateAuthToken();
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(error.statusCode || 500).send(`Error logging in: ${(error as Error).message}`);
    }
  }
}
  
  // Export Singleton Instance
  export const userService = new UserService();