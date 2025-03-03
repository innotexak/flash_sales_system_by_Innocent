import express, { Request, Response } from "express";
import { getUsers, createUser, getUserByEmail } from "./userService";

const app = express();
app.use(express.json());

app.get("/users", (req: Request, res: Response) => {
  res.status(200).json(getUsers());
});

app.post("/users", (req: Request, res: Response) => {
  const user = createUser(req.body);
  res.status(201).json(user);
});

app.get('/users/:email', (req: any, res: any) => { 
  const email = req.params.email
  const user = getUserByEmail(email)
  if(user){ 
    res.status(200).json(user)
  }
  return res.status(404).json({message:"User not found"})
    
});

export default app;


