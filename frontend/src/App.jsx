import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import ContestsPage from "./pages/ContestsPage";
import ContestDetailPage from "./pages/ContestDetailPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const isDevelopment = false;

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={isDevelopment || isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isDevelopment || isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isDevelopment || isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isDevelopment || isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
        <Route path="/contests" element={isDevelopment || isSignedIn ? <ContestsPage /> : <Navigate to={"/"} />} />
        <Route path="/contest/:id" element={isDevelopment || isSignedIn ? <ContestDetailPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;