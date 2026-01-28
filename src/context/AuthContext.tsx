import { createContext, useContext, useState, ReactNode } from "react";
import type { UserRole } from "../data/navItems";

type User = {
  id: number;
  name: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  loginAsAdmin: () => void;
  loginAsManager: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // fake login state (replace with backend later)
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: "Amina",
    role: "admin",
  });

  const loginAsAdmin = () =>
    setUser({ id: 1, name: "Admin User", role: "admin" });

  const loginAsManager = () =>
    setUser({ id: 2, name: "Manager User", role: "manager" });

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, loginAsAdmin, loginAsManager, logout }}
    >
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
