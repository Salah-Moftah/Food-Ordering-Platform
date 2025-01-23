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
const getRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            res.status(404).json({ message: "restaurant not found" });
            return;
        }
        res.json(restaurant);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
const searchRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = req.params.city;
        const searchQuery = req.query.searchQuery || ""; // Search keyword for filtering results
        const selectedCuisines = req.query.selectedCuisines || ""; // Filter by selected cuisines
        const sortOption = req.query.sortOption || "lastUpdated"; // Sorting option (default: "lastUpdated")
        const page = parseInt(req.query.page) || 1; // Current page for pagination (default: 1)
        // Initialize an empty query object to build the MongoDB query
        let query = {};
        // Add a case-insensitive city filter using a regular expression
        query["city"] = new RegExp(city, "i");
        // Check if there are any documents in the database that match the city filter
        const cityCheck = yield restaurant_1.default.countDocuments(query);
        if (cityCheck === 0) {
            res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1,
                }
            });
            return;
        }
        if (selectedCuisines) {
            // URL = selectedCusisines=Egyption,Burgers,pizza => convert to [egyption, burgers, pizza]
            const cuisinesArray = selectedCuisines
                .split(",")
                .map((cuisine) => new RegExp(cuisine, "i"));
            query["cuisines"] = { $all: cuisinesArray };
        }
        if (searchQuery) {
            // example:
            // restaurantName = Pizza shop
            // cuisines = [Pizza, Pasta]
            // searchQuery = Pasta
            const searchRegex = new RegExp(searchQuery, "i");
            query["$or"] = [
                { restaurantName: searchRegex },
                { cuisines: { $in: [searchRegex] } },
            ];
        }
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const restaurants = yield restaurant_1.default.find(query)
            .sort({ [sortOption]: 1 }) // Sort the results based on the "sortOption" parameter ( 1 ) (default is ascending order)
            .skip(skip) // Skip a certain number of documents for pagination
            .limit(pageSize) // Limit the number of documents returned to the page size
            .lean(); // Use "lean" to return plain JavaScript objects instead of Mongoose documents for better performance
        const total = yield restaurant_1.default.countDocuments(query);
        const response = {
            data: restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize), // 50 results, pageSize 10 => 50 / 10 = 5 pages
            },
        };
        res.json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.default = {
    searchRestaurant,
    getRestaurant
};
