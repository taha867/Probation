import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      /**
       * Authenticated user information
       * Added by authenticateToken middleware after JWT verification
       */
      user?: {
        id: number;
      };
      /**
       * Uploaded file information
       * Added by multer middleware for file uploads
       */
      file?: Express.Multer.File;
    }
  }
}

export {}; //Makes this file a module.Required for declare global to work




/**
What happens at runtime (JavaScript):
// In your middleware req.user = { id: 123 };  // Works fine - JavaScript allows this
// Later in your controller const userId = req.user.id;  //  Works fine
What happens at compile-time (TypeScript):
// In your middlewarereq.user = { id: 123 };  // ERROR: Property 'user' does not exist on type 'Request'
// Later in your controllerconst userId = req.user.id;  // ERROR: Property 'user' does not exist
Why:
Express’s Request type doesn’t include user
TypeScript only knows what’s in the type definitions
Your middleware adds user at runtime, but TypeScript doesn’t know about it
What this file does
This file tells TypeScript: “The Express Request interface now includes a user property.”
 * 
 * 
 * */