import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SideBar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/LoadingSpinner";
import useAuthUser from "./hooks/useAuthUser";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/auth/login/Login"));
const SignUp = lazy(() => import("./pages/auth/signup/SignUp"));
const Home = lazy(() => import("./pages/home/Home"));
const NotificationPage = lazy(() => import("./pages/notification/NotificationPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));

function App() {
  const { data: authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        {authUser && <SideBar />}
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
            <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          </Routes>
        </Suspense>
        {authUser && <RightPanel />}
        <Toaster />
      </div>
    </>
  );
}

export default App;
