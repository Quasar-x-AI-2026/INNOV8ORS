import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import ReportPrice from "./pages/ReportPrice";
import Result from "./pages/Result";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";

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
            {/* Onboarding route - no protection needed */}
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Protected routes - require onboarding completion */}
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
            
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </SignedIn>
    </div>
  );
}

export default App;