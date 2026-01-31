import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import ReportPrice from "./pages/ReportPrice";
import Result from "./pages/Result";
import History from "./pages/History";
import Profile from "./pages/Profile";        
import Notifications from "./pages/Notifications";  
import ProtectedRoute from "./components/ProtectedRoute";
import MarketMap from "./pages/Marketmap";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";


import AdminLayout from "./pages/admin/AdminLayout";
import FlaggedReports from "./pages/admin/FlaggedReports";
import InspectReport from "./pages/admin/InspectReport";
import MarketHealth from "./pages/admin/MarketHealth";
import UserActivity from "./pages/admin/UserActivity";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <SignedOut>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </SignedOut>

      <SignedIn>
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-price"
              element={
                <ProtectedRoute>
                  <ReportPrice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/market-map"
              element={
                <ProtectedRoute>
                  <MarketMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:productName"
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />

            
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<FlaggedReports />} />
              <Route path="flagged-reports" element={<FlaggedReports />} />
              <Route path="inspect/:id" element={<InspectReport />} />
              <Route path="markets" element={<MarketHealth />} />
              <Route path="users" element={<UserActivity />} />
            </Route>
            
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </SignedIn>
    </div>
  );
}

export default App;