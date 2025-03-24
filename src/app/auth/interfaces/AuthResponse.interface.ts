import { UserAuth } from "./UserAuth.interface";

export interface AuthResponse {
  userAuth: UserAuth;
  token: string;
}


