import { create } from "zustand";
// import jwt from "jsonwebtoken";

export type UserData = {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  user: UserData | null;
  login: (data: UserData) => void;
  logout: () => void;
};

export const useUserStore = create<User>((set) => ({
  user: null,
  login: (data: UserData) => {
    // const userData = jwt.decode(token) as UserData;
    // if (!userData) throw new Error("Invalid token");
    // document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
    // localStorage.setItem("token", token);
    set({ user: data });
  },
  logout: () => {
    // localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    set({ user: null });
  },
}));
