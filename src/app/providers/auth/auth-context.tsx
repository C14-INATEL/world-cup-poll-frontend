import type { User, UserLogin, UserRegister } from "@/entities/user/types";
import { createContext } from "react";

export interface AuthContextData {
  login(input: UserLogin): Promise<void>;
  register(input: UserRegister): Promise<void>;
  logout(): Promise<void>;
  user: User | null;
  isAuthLoading: boolean;
}

export const AuthContext = createContext({} as AuthContextData);
