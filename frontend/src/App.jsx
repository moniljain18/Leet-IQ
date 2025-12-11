import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
// import ProblemPage from "./pages/ProblemPage";
// import ProblemsPage from "./pages/ProblemsPage";
// import SessionPage from "./pages/SessionPage";

function App() {
  // Temporarily disabled Clerk for development
  // const { isSignedIn, isLoaded } = useUser();
  const isSignedIn = false; // Temporarily hardcoded
  const isDevelopment = true; // Set to false when Clerk is ready

  return (
    <>


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={isDevelopment || isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        {/* <Route path="/problems" element={isDevelopment || isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isDevelopment || isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isDevelopment || isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} /> */}
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;