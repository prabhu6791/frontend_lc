import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/customer/Dashboard";
import Admin from "./pages/admin/Admin";
import ProtectedRoute from "./ProtectedRoute";
import Customer from "./pages/admin/Customers";
import Products from "./pages/admin/Products";
import ProductCustomer from "./pages/customer/Product";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected user route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/product"
          element={
            <ProtectedRoute>
              <ProductCustomer />
            </ProtectedRoute>
          }
        />

        {/* Protected admin route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customer-control"
          element={
            <ProtectedRoute adminOnly={true}>
              <Customer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product-control"
          element={
            <ProtectedRoute adminOnly={true}>
              <Products />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
