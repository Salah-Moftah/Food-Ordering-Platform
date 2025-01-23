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
const restaurant_1 = __importDefault(require("../models/restaurant"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
const order_1 = __importDefault(require("../models/order"));
const getMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myRestaurant = yield restaurant_1.default.findOne({ user: req.userId });
        if (!myRestaurant) {
            res.status(404).json({ message: 'Restaurant not found' });
            return;
        }
        res.json(myRestaurant);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
const createMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingRestaurant = yield restaurant_1.default.findOne({ user: req.userId });
        if (existingRestaurant) {
            res.status(409).json({ message: 'User restaurant already exists' });
            return;
        }
        const imageUrl = yield uploadImage(req.file);
        const restaurant = new restaurant_1.default(req.body);
        restaurant.imageUrl = imageUrl;
        // Link the restaurant to the user who created it by setting the user field to the user's ID
        restaurant.user = new mongoose_1.default.Types.ObjectId(req.userId);
        restaurant.lastUpdate = new Date();
        yield restaurant.save();
        res.status(201).send(restaurant);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
const updateMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_1.default.findOne({
            user: req.userId,
        });
        if (!restaurant) {
            res.status(404).json({ message: 'restaurant not found' });
            return;
        }
        restaurant.restaurantName = req.body.restaurantName;
        restaurant.city = req.body.city;
        restaurant.country = req.body.country;
        restaurant.deliveryPrice = req.body.deliveryPrice;
        restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurant.cuisines = req.body.cuisines;
        restaurant.menuItems = req.body.menuItems;
        restaurant.lastUpdate = new Date();
        if (req.file) {
            const imageUrl = yield uploadImage(req.file);
            restaurant.imageUrl = imageUrl;
        }
        yield restaurant.save();
        res.status(200).send(restaurant);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
const getMyRestaurantOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_1.default.findOne({ user: req.userId });
        if (!restaurant) {
            res.status(404).json({ message: "restaurant not found" });
            return;
        }
        const orders = yield order_1.default.find({ restaurant: restaurant._id })
            .populate("restaurant")
            .populate("user");
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = yield order_1.default.findById(orderId);
        if (!order) {
            res.status(404).json({ message: "order not found" });
            return;
        }
        const restaurant = yield restaurant_1.default.findById(order.restaurant);
        if (((_a = restaurant === null || restaurant === void 0 ? void 0 : restaurant.user) === null || _a === void 0 ? void 0 : _a._id.toString()) !== req.userId) {
            res.status(401).send();
            return;
        }
        order.status = status;
        yield order.save();
        res.status(200).json(order);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "unable to update order status" });
    }
});
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    // Access the uploaded file from the request object and cast it as an Express.Multer.File
    const image = file;
    // Convert the image buffer (binary data) to a Base64-encoded string
    const base64Image = Buffer.from(image.buffer).toString('base64');
    // Create a Data URI by combining the image's MIME type and its Base64-encoded content
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    // // This code processes an uploaded image file, converts it into a Base64-encoded string, and generates a Data URI. The resulting dataURI can be used directly in web applications (e.g., in src attributes of <img> tags) to display the image without needing to store it on a server or access it via a URL.
    // Upload the image to Cloudinary using its API and the generated Data URI
    const uploadResponse = yield cloudinary_1.default.v2.uploader.upload(dataURI);
    return uploadResponse.url;
});
exports.default = {
    createMyRestaurant,
    getMyRestaurant,
    updateMyRestaurant,
    getMyRestaurantOrders,
    updateOrderStatus
};
