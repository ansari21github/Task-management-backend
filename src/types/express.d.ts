// import { User } from '../models/User'; // Adjust the import based on your project structure

// declare global {
//   namespace Express {
//     interface Request {
//       user?: User; // Add a custom user property to the Request interface
//     }
//   }
// }
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      // Add other user properties if needed
    };
  }
}