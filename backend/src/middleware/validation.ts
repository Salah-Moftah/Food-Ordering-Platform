import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return
  }
  next();
};

export const validateMyUserRequest = [
  body("name").isString().withMessage("Name must be a string").notEmpty(),
  body("addressLine1").notEmpty().withMessage("AddressLine1 must be a string"),
  body("city").notEmpty().withMessage("city must be a string"),
  body("country").notEmpty().withMessage("country must be a string"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery price must be a positive number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Estimated delivery time must be a postivie integar"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisines must be an array")
    .not()
    .isEmpty()
    .withMessage("Cuisines array cannot be empty"),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Menu item price is required and must be a postive number"),
  handleValidationErrors,
];