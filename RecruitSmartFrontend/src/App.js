import React ,{ useEffect }from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard"; // Ensure this path is correct
import AdminLogin from './components/AdminDashboard/AdminLogin.jsx';
import CompatibilityTest from './components/Compatibility/CompatibilityTest.jsx';
import InterviewPrerequisite from './components/Compatibility/InterviewPrerequisite.jsx';
import FeedbackPage from './components/FeedbackPage/FeedbackPage';
import Dashboard from './components/Home/Dashboard.jsx';
import Home from './components/Home/Homepage.jsx';
import RequireRedirect from './components/RequireRedirect';
import UserDashboard from './components/UserDashboard/DashboardUser/UserDashboard.jsx';
import UserLogin from './components/UserDashboard/LoginUser/UserLogin.jsx';
import UserSignup from './components/UserDashboard/SignupUser/UserSignup';
import InterviewPage from "./components/UserDashboard/Simulation/Interviewpage"; // Ensure this path is correct
import ResumeUploadPage from "./components/UserDashboard/Simulation/ResumeUploadPage.jsx";
import ExpertDashboard from './components/expertdashboard/ExpertDashboard.jsx';
import ExpertLogin from './components/expertdashboard/LoginPage/ExpertLogin.jsx'


import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute.js';
import { UserAuthProvider } from "./components/UserDashboard/Auth/UserAuthContext.js";
import UserPrivateRoute from "./components/UserDashboard/Auth/UserPrivateRoute.js";

function App(){
  const isAllowed = true;
  useEffect(() => {
    document.title = 'RecruitSmart'; // Set your app title

    // Update the favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = '/logors.jpg'; // Path to your favicon
    }
  }, []);
  return (
    <AuthProvider>
    <UserAuthProvider>    
    <Router>
      <Routes>
        <Route path="/InterviewPage/:command_id" element={<InterviewPage />} />
        <Route path="/admin-dashboard" element={<PrivateRoute ><AdminDashboard /></PrivateRoute >}/>
        <Route path="/" element={<Home />} />
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/UserDashboard" element={<UserPrivateRoute><UserDashboard /></UserPrivateRoute>} />
        <Route path="/expert" element={<ExpertDashboard />} />
        <Route path="/ExpertLogin" element={<ExpertLogin />} />
        <Route path="/upload-resume" element={<ResumeUploadPage />} />
        <Route path="/upload-resume/:command_id" element={<ResumeUploadPage />} />
        <Route path="/CompatibilityTest/:command_id" element={<CompatibilityTest />} />
        <Route path="/InterviewPrerequisite" element={<InterviewPrerequisite />} />
        <Route path="/feedback" element={<FeedbackPage  />} /> {/* Add the feedback route */}
        

                <Route
          path="/Dashboard"
          element={
            <RequireRedirect isAllowed={isAllowed}>
              <Dashboard />
            </RequireRedirect>
          }
        />

      </Routes>
    </Router>
    </UserAuthProvider> 
    </AuthProvider>
  );
}

export default App;
