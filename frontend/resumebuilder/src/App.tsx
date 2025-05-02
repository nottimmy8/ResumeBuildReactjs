// import React from "react";

// import Login from "./pages/Auth/Login";
// import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Home/Dashboard";
import LandingPage from "./pages/LandingPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditResume from "./pages/ResumeUpdate/EditResume";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
const App = () => {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume/:resumeId" element={<EditResume />} />{" "}
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </>
  );
};

export default App;
