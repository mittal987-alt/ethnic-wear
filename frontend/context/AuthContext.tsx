"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import API from "../services/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* 🔑 Restore user on refresh */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUserState(data); // ✅ correct
      } catch {
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* ✅ SAVE USER + TOKEN (used on login) */
  const setUser = (user: User, token?: string) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setUserState(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
