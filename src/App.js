import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

const Signup = React.lazy(() => import("./pages/Signup"));
const Login = React.lazy(() => import("./pages/Login"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));

const App = () => {
  return (
    <Router>
      <Header />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          <Route
            path="/tasks"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route path="/userprofile" element={<UserProfile />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
