import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { UserRole } from "../data/navItems";

type User = {
  id: number;
  name: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  login: (role: UserRole, username?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage (demo token) so login persists across refresh
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem("demo_token");
      const role = (localStorage.getItem("demo_role") || "manager") as UserRole;
      const name = localStorage.getItem("demo_name") || "Demo User";
      if (token) {
        return { id: 1, name, role };
      }
    } catch (e) {
      throw new Error("Failed to access localStorage for auth initialization: " + (e as Error).message);
    }
    return null;
  });

  useEffect(() => {
    // Keep localStorage in sync if user state changes externally
    if (!user) {
      localStorage.removeItem("demo_token");
      localStorage.removeItem("demo_role");
      localStorage.removeItem("demo_name");
    }
  }, [user]);

  const login = (role: UserRole, username?: string) => {
    const name = username || (role === "admin" ? "Admin User" : "Manager User");
    try {
      localStorage.setItem("demo_token", "demo-token");
      localStorage.setItem("demo_role", role);
      localStorage.setItem("demo_name", name);
    } catch (e) {
      throw new Error("Failed to set localStorage for auth login: " + (e as Error).message);
    }
    setUser({ id: 1, name, role });
  };

  const logout = () => {
    try {
      localStorage.removeItem("demo_token");
      localStorage.removeItem("demo_role");
      localStorage.removeItem("demo_name");
    } catch (e) {
      throw new Error((e as Error).message);  
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
