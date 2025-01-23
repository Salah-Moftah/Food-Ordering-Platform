import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId })
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
}

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, city, country, addressLine1 } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found"});
      return;
    }
    user.name = name;
    user.city = city;
    user.country = country;
    user.addressLine1 = addressLine1;
    const updateUser = await user.save();

    res
      .status(200)
      .json({ message: "user updated successfully", user: updateUser });
  } catch (error) {
    
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};


export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
};
