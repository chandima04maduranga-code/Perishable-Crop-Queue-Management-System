import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CropBatches from "./pages/CropBatches.jsx";
import AddCrop from "./pages/AddCrop.jsx";
import EditCrop from "./pages/EditCrop.jsx";
import DistributionQueue from "./pages/DistributionQueue.jsx";
import DistributionHistory from "./pages/DistributionHistory.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="crops" element={<CropBatches />} />
          <Route path="crops/add" element={<AddCrop />} />
          <Route path="crops/:id/edit" element={<EditCrop />} />
          <Route path="distribution" element={<DistributionQueue />} />
          <Route path="history" element={<DistributionHistory />} />
          <Route
            path="*"
            element={
              <div className="panel">
                <h2>Page not found</h2>
                <Link to="/">Return to dashboard</Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
