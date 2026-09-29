import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CropBatches from "./pages/CropBatches.jsx";
import AddCrop from "./pages/AddCrop.jsx";
import EditCrop from "./pages/EditCrop.jsx";
import DistributionQueue from "./pages/DistributionQueue.jsx";
import DistributionHistory from "./pages/DistributionHistory.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import Account from "./pages/Account.jsx";
import About from "./pages/About.jsx";
import { CROP_ROLES } from "./utils/permissions.js";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="crops" element={<CropBatches />} />
          <Route path="distribution" element={<DistributionQueue />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="crops/add"
            element={
              <ProtectedRoute roles={CROP_ROLES}>
                <AddCrop />
              </ProtectedRoute>
            }
          />
          <Route
            path="crops/:id/edit"
            element={
              <ProtectedRoute roles={CROP_ROLES}>
                <EditCrop />
              </ProtectedRoute>
            }
          />
          <Route
            path="history"
            element={
              <ProtectedRoute>
                <DistributionHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="panel access-card">
                <h1>Page not found</h1>
                <p>This page may have moved.</p>
                <Link className="button primary" to="/">
                  Return to overview
                </Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
