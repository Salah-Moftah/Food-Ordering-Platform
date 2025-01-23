import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: "restaurant not found" });
      return 
    }

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
}

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || ""; // Search keyword for filtering results
    const selectedCuisines = (req.query.selectedCuisines as string) || ""; // Filter by selected cuisines
    const sortOption = (req.query.sortOption as string) || "lastUpdated"; // Sorting option (default: "lastUpdated")
    const page = parseInt(req.query.page as string) || 1; // Current page for pagination (default: 1)

    // Initialize an empty query object to build the MongoDB query
    let query: any = {};
    // Add a case-insensitive city filter using a regular expression
    query["city"] = new RegExp(city, "i");

    // Check if there are any documents in the database that match the city filter
    const cityCheck = await Restaurant.countDocuments(query);
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

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 }) // Sort the results based on the "sortOption" parameter ( 1 ) (default is ascending order)
      .skip(skip) // Skip a certain number of documents for pagination
      .limit(pageSize) // Limit the number of documents returned to the page size
      .lean(); // Use "lean" to return plain JavaScript objects instead of Mongoose documents for better performance

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize), // 50 results, pageSize 10 => 50 / 10 = 5 pages
      },
    };
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  searchRestaurant,
  getRestaurant
};
