import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../data/navItems";

export function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: UserRole[];
}) {
  const { user } = useAuth();

  // not logged in
  if (!user) return <Navigate to="/login" replace />;

  // logged in but not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
