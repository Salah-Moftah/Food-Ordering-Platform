"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_1.default.findOne({ _id: req.userId });
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(currentUser);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
});
const createCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id } = req.body;
        const existingUser = yield user_1.default.findOne({ auth0Id });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const newUser = new user_1.default(req.body);
        yield newUser.save();
        res.status(201).json(newUser.toObject());
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
});
const updateCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, city, country, addressLine1 } = req.body;
        const user = yield user_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.name = name;
        user.city = city;
        user.country = country;
        user.addressLine1 = addressLine1;
        const updateUser = yield user.save();
        res
            .status(200)
            .json({ message: "user updated successfully", user: updateUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating user" });
    }
});
exports.default = {
    createCurrentUser,
    updateCurrentUser,
    getCurrentUser,
};
