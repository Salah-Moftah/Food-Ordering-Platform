import express from "express";
import MyRestaurantController from "../controllers/MyRestaurantController";
import multer from "multer";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

// Configure Multer for file uploads with in-memory storage
const storage = multer.memoryStorage(); // Store uploaded files in memory as a buffer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Set the maximum file size to 5 MB
  },
});

router.get(
  "/order",
  jwtCheck,
  jwtParse,
  MyRestaurantController.getMyRestaurantOrders
);

router.patch(
  "/order/:orderId/status",
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateOrderStatus
);

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

router.post(
  "/",
  upload.single("imageFile"), // Middleware to handle a single file upload with the field name "imageFile"
  validateMyRestaurantRequest,
  jwtCheck, // Middleware to check if the user's JWT is valid
  jwtParse, // Middleware to parse and extract user information from the JWT
  MyRestaurantController.createMyRestaurant
);

router.put(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateMyRestaurant
);

export default router;
