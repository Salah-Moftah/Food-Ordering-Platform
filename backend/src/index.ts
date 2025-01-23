import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";

const PORT = process.env.PORT || 7000;

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONDODB_CONNECTION_STRING as string)
.then(() => {
  console.log("Connected to Database.");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Initialize Express app
const app = express();

// Middleware to enable CORS for cross-origin requests
app.use(cors());

app.use(
  "/api/order/checkout/webhook",
  // Use express.raw() middleware to process incoming request bodies as raw binary data (Buffer)
  express.raw({
    type: "*/*", // This specifies that the middleware should apply to all content types
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to my API!" });
});

// It allows external systems or developers to verify that the application is running and responsive by returning a basic "health OK!" message when the endpoint is accessed.
app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'health OK!'})
})

app.use("/api/my/user", myUserRoute);

app.use("/api/my/restaurant", myRestaurantRoute);

app.use("/api/restaurant", restaurantRoute);

app.use("/api/order", orderRoute);

// Start the server on port 7000
app.listen(PORT || process.env.PORT, () => {
  console.log("Server Started");
});
