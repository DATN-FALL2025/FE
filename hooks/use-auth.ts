"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
  role: "admin" | "head" | "academic-staff" | "training-director" | "trainee";
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, role: string) => {
        set({
          user: { email, role: role as any },
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

