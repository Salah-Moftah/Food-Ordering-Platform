import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";
declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

// Create middleware to validate JWT tokens
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE, // Expected API audience
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL, // Auth0 domain
  tokenSigningAlg: "RS256", // Token signing algorithm
});

//  Middleware to validate and parse a JWT from the request's authorization header.
export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract the "authorization" header from the request
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.sendStatus(401);
    return 
  }

  const token = authorization.split(" ")[1];

  try {
    // Decode the JWT token to extract its payload
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    // Get the "sub" field from the decoded token (usually the user's identifier)
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      res.sendStatus(401);
      return
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    res.sendStatus(401);
    return
  }
};
