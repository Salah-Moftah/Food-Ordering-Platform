"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MyRestaurantController_1 = __importDefault(require("../controllers/MyRestaurantController"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Configure Multer for file uploads with in-memory storage
const storage = multer_1.default.memoryStorage(); // Store uploaded files in memory as a buffer
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Set the maximum file size to 5 MB
    },
});
router.get("/order", auth_1.jwtCheck, auth_1.jwtParse, MyRestaurantController_1.default.getMyRestaurantOrders);
router.patch("/order/:orderId/status", auth_1.jwtCheck, auth_1.jwtParse, MyRestaurantController_1.default.updateOrderStatus);
router.get("/", auth_1.jwtCheck, auth_1.jwtParse, MyRestaurantController_1.default.getMyRestaurant);
router.post("/", upload.single("imageFile"), // Middleware to handle a single file upload with the field name "imageFile"
validation_1.validateMyRestaurantRequest, auth_1.jwtCheck, // Middleware to check if the user's JWT is valid
auth_1.jwtParse, // Middleware to parse and extract user information from the JWT
MyRestaurantController_1.default.createMyRestaurant);
router.put("/", upload.single("imageFile"), validation_1.validateMyRestaurantRequest, auth_1.jwtCheck, auth_1.jwtParse, MyRestaurantController_1.default.updateMyRestaurant);
exports.default = router;
