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
const MyUserRoute_1 = __importDefault(require("./routes/MyUserRoute"));
const PORT = process.env.PORT || 7000;
// Connect to MongoDB using the connection string from .env
mongoose_1.default.connect(process.env.MONDODB_CONNECTION_STRING).then(() => {
    console.log("Connected to Database.");
});
// Initialize Express app
const app = (0, express_1.default)();
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
// Middleware to enable CORS for cross-origin requests
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send({ message: "Welcome to my API!" });
});
// It allows external systems or developers to verify that the application is running and responsive by returning a basic "health OK!" message when the endpoint is accessed.
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ message: 'health OK!' });
}));
// Add route for user-related API requests
app.use("/api/my/user", MyUserRoute_1.default);
// Start the server on port 7000
app.listen(PORT || process.env.PORT, () => {
    console.log("Server Started");
});
