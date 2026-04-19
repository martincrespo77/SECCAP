import type { AuthUser } from './middleware/authenticate.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}
