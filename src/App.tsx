import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import ManageUsers from "./pages/ManageUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/users" element={<ManageUsers />} /> {/* route to display users */}

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
