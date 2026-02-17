import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import ManageUsers from "./pages/ManageUsers";
import ViewProduct from "./pages/ViewProduct";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ViewInventory from "./pages/ViewInventory";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import { useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route - Login */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />

      {/* Protected routes */}
      {user ? (
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<ManageUsers />} />
          
          {/* Orders */}
          <Route path="/orders" element={<Orders />} />
          
          {/* PRODUCTS */}
          <Route path="/products" element={<ViewProduct />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:productId/edit" element={<EditProduct />} />

          {/* INVENTORY */}
          <Route path="/inventory" element={<ViewInventory />} />
          
          {/* SETTINGS */}
          <Route path="/settings" element={<Settings />} />

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/user-management" element={<Users />} />
          </Route>
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
