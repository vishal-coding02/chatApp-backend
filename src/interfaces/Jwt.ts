import { JwtPayload } from "jsonwebtoken";

export interface User {
  _id: string;
  userName: string;
}

export interface TokenPayload extends JwtPayload {
  id: string;
  name: string;
}
