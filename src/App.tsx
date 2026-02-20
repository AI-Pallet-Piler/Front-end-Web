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
import RequireAuth from "./routes/RequireAuth";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route: login (no sidebar/layout) */}
        <Route path="/login" element={<Login />} />

        {/* Protected app routes: require auth, then render Layout with sidebar */}
        <Route element={<RequireAuth />}>
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
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
