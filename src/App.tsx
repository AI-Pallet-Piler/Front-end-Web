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



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<ManageUsers />} /> {/* route to display users */}
          {/* PRODUCTS */}
          <Route path="/products" element={<ViewProduct />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:productId/edit" element={<EditProduct />} />
            {/* INVENTORY */}
          <Route path="/inventory" element={<ViewInventory />} />


          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>

        {/* later: <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
