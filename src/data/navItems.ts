import {
  LayoutGrid,
  Package,
  Boxes,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type UserRole = "admin" | "manager" | "picker";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  roles?: UserRole[]; 
};

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid, roles: ["admin", "manager"] },

  { label: "Products", to: "/products", icon: Package, roles: ["admin", "manager"] },
  { label: "Inventory", to: "/inventory", icon: Boxes, roles: ["admin", "manager"] },

  { label: "Users", to: "/users", icon: Users, roles: ["admin", "manager"] },
  { label: "Settings", to: "/settings", icon: Settings, roles: ["admin", "manager"] },
];
