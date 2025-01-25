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
const stripe_1 = __importDefault(require("stripe"));
const restaurant_1 = __importDefault(require("../models/restaurant"));
const order_1 = __importDefault(require("../models/order"));
const STRIPE = new stripe_1.default(process.env.STRIPE_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find({ user: req.userId })
            .populate("restaurant")
            .populate("user");
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
// Handles Stripe webhook events sent to the server
const stripeWebhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let event;
    try {
        // Retrieve the Stripe signature from the request headers
        const sig = req.headers["stripe-signature"];
        // Verify and construct the event using Stripe's SDK
        event = STRIPE.webhooks.constructEvent(req.body, sig, STRIPE_ENDPOINT_SECRET);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(`Webhook error: ${error.message}`);
        return;
    }
    if (event.type === "checkout.session.completed") {
        // Retrieve the order ID from the event's metadata
        const order = yield order_1.default.findById((_a = event.data.object.metadata) === null || _a === void 0 ? void 0 : _a.orderId);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        // Update the order details with payment information
        order.totalAmount = event.data.object.amount_total;
        order.status = "paid";
        yield order.save();
    }
    res.status(200).send();
});
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkoutSessionRequest = req.body;
        const restaurant = yield restaurant_1.default.findById(checkoutSessionRequest.restaurantId);
        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        const newOrder = new order_1.default({
            restaurant: restaurant,
            user: req.userId,
            status: 'placed',
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date(),
        });
        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);
        const session = yield createSession(lineItems, newOrder._id.toString(), restaurant.deliveryPrice, restaurant._id.toString());
        if (!session.url) {
            res.status(500).json({ message: "Error creating stripe session" });
            return;
        }
        yield newOrder.save();
        res.json({ url: session.url });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.raw.message });
    }
});
// Function to create line items for a checkout session
const createLineItems = (checkoutSessionRequest, // Contains cart items requested for the checkout session
menuItems // Array of menu items available for reference
) => {
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItemId.toString());
        if (!menuItem) {
            throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
        }
        // Create a line item for the Stripe checkout session
        const line_item = {
            price_data: {
                currency: "gbp", // Currency for the item pricing
                unit_amount: menuItem.price,
                product_data: {
                    name: menuItem.name,
                },
            },
            quantity: parseInt(cartItem.quantity),
        };
        return line_item;
    });
    return lineItems;
};
const createSession = (lineItems, orderId, deliveryPrice, restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionData = yield STRIPE.checkout.sessions.create({
        line_items: lineItems,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: deliveryPrice,
                        currency: "gbp",
                    },
                },
            },
        ],
        mode: "payment",
        metadata: {
            orderId,
            restaurantId,
        },
        // success_url: `${FRONTEND_URL}/order-status?success=true`,
        success_url: `${FRONTEND_URL}`,
        cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
    });
    return sessionData;
});
exports.default = {
    createCheckoutSession,
    stripeWebhookHandler,
    getMyOrders
};
