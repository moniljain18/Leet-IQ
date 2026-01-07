import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import ContestsPage from "./pages/ContestsPage";
import ContestDetailPage from "./pages/ContestDetailPage";
import JoinPage from "./pages/JoinPage";
import AdminPage from "./pages/AdminPage";
import PremiumPage from "./pages/PremiumPage";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage";
import StorePage from "./pages/StorePage";
import OrdersPage from "./pages/OrdersPage";
import BanCheck from "./components/BanCheck";
import { setAuthTokenGetter } from "./lib/axios";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const isDevelopment = false;

  // Set up axios auth token getter
  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <BanCheck>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={isDevelopment || isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isDevelopment || isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isDevelopment || isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />

        {/* Session routes */}
        <Route
          path="/session/:id"
          element={isDevelopment || isSignedIn ? <SessionPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/join/:inviteCode"
          element={isDevelopment || isSignedIn ? <JoinPage /> : <Navigate to={"/"} />}
        />

        <Route path="/contests" element={isDevelopment || isSignedIn ? <ContestsPage /> : <Navigate to={"/"} />} />
        <Route path="/contest/:id" element={isDevelopment || isSignedIn ? <ContestDetailPage /> : <Navigate to={"/"} />} />

        {/* Admin route */}
        <Route path="/admin" element={isDevelopment || isSignedIn ? <AdminPage /> : <Navigate to={"/"} />} />

        {/* Premium Page - accessible to all */}
        <Route path="/premium" element={<PremiumPage />} />

        {/* Store routes */}
        <Route path="/store" element={<StorePage />} />
        <Route path="/orders" element={isSignedIn ? <OrdersPage /> : <Navigate to={"/"} />} />

        {/* Subscription Success - activates premium after checkout */}
        <Route path="/subscription/success" element={isSignedIn ? <SubscriptionSuccessPage /> : <Navigate to={"/"} />} />

        {/* Catch-all route for 404 - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </BanCheck>
  );
}

export default App;