declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        roles: string[];
        adminPermissions: string[];
      };
    }
  }
}
export {};
