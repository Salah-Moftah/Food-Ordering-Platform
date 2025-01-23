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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = require("cloudinary");
const MyUserRoute_1 = __importDefault(require("./routes/MyUserRoute"));
const MyRestaurantRoute_1 = __importDefault(require("./routes/MyRestaurantRoute"));
const RestaurantRoute_1 = __importDefault(require("./routes/RestaurantRoute"));
const OrderRoute_1 = __importDefault(require("./routes/OrderRoute"));
const PORT = process.env.PORT || 7000;
// Connect to MongoDB using the connection string from .env
mongoose_1.default.connect(process.env.MONDODB_CONNECTION_STRING)
    .then(() => {
    console.log("Connected to Database.");
});
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Initialize Express app
const app = (0, express_1.default)();
// Middleware to enable CORS for cross-origin requests
app.use((0, cors_1.default)());
app.use("/api/order/checkout/webhook", 
// Use express.raw() middleware to process incoming request bodies as raw binary data (Buffer)
express_1.default.raw({
    type: "*/*", // This specifies that the middleware should apply to all content types
}));
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send({ message: "Welcome to my API!" });
});
// It allows external systems or developers to verify that the application is running and responsive by returning a basic "health OK!" message when the endpoint is accessed.
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ message: 'health OK!' });
}));
app.use("/api/my/user", MyUserRoute_1.default);
app.use("/api/my/restaurant", MyRestaurantRoute_1.default);
app.use("/api/restaurant", RestaurantRoute_1.default);
app.use("/api/order", OrderRoute_1.default);
// Start the server on port 7000
app.listen(PORT || process.env.PORT, () => {
    console.log("Server Started");
});
