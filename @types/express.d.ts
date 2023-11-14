// import { User } from "src/user/entities/user.entity";

declare namespace Express {
  interface Request {
    user?: User;
  }
}
