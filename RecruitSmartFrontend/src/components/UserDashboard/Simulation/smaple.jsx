import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, useLocation, BrowserRouter as Router, useNavigate } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard"; // Ensure this path is correct
import AdminLogin from './components/AdminDashboard/AdminLogin.jsx';
import CompatibilityTest from './components/Compatibility/CompatibilityTest.jsx';
import FeedbackPage from './components/FeedbackPage/FeedbackPage';
import Dashboard from './components/Home/Dashboard.jsx';
import Home from './components/Home/Homepage.jsx';
import RequireRedirect from './components/RequireRedirect';
import UserDashboard from './components/UserDashboard/DashboardUser/UserDashboard.jsx';
import UserLogin from './components/UserDashboard/LoginUser/UserLogin.jsx';
import UserSignup from './components/UserDashboard/SignupUser/UserSignup';
import InterviewPage from "./components/UserDashboard/Simulation/Interviewpage"; // Ensure this path is correct
import ResumeUploadPage from "./components/UserDashboard/Simulation/ResumeUploadPage.jsx";
import ExpertUpload from './components/expertdashboard/ExpertUpload.jsx';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

function App(){
  const isAllowed = true;
  const [alertShown, setAlertShown] = useState(false);
  const [personAlertShown, setPersonAlertShown] = useState(false);
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };

    loadModel();

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }).catch(err => {
        console.error("Error accessing webcam: ", err);
      });
    };

    const stopVideo = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    if (location.pathname.includes("/InterviewPage")) {
      startVideo();
    } else {
      stopVideo();
    }
  }, [location.pathname]);

  useEffect(() => {
    const detectObjects = async () => {
      if (model && videoRef.current && videoRef.current.readyState === 4) { // Ensure video is ready
        const predictions = await model.detect(videoRef.current);
        let personDetected = false;
        predictions.forEach(prediction => {
          if (prediction.class === 'cell phone' && !alertShown) {
            alert("Mobile phone detected. Please focus on the interview.");
            setAlertShown(true);
          }
          if (prediction.class === 'person') {
            personDetected = true;
          }
        });
        if (!personDetected && !personAlertShown) {
          alert("No person detected. Please stay in front of the camera.");
          setPersonAlertShown(true);
        } else if (personDetected) {
          setPersonAlertShown(false);
        }
      }
    };

    if (location.pathname.includes("/InterviewPage")) {
      const interval = setInterval(detectObjects, 1000);
      return () => clearInterval(interval);
    }
  }, [model, alertShown, personAlertShown, location.pathname]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !alertShown) {
        alert("You have switched tabs. Please focus on the interview page to continue.");
        setAlertShown(true);
      } else if (!document.hidden) {
        setAlertShown(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [alertShown]);

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ display: 'none' }} />
      <Routes>
        <Route path="/InterviewPage/:command_id" element={<InterviewPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/expert" element={<ExpertUpload />} />
        <Route path="/upload-resume" element={<ResumeUploadPage />} />
        <Route path="/upload-resume/:command_id" element={<ResumeUploadPage />} />
        <Route path="/CompatibilityTest/:command_id" element={<CompatibilityTest />} />
        <Route path="/feedback" element={<FeedbackPage  />} /> {/* Add the feedback route */}
        <Route path="/ExpertUpload" element={<ExpertUpload  />} /> {/* Add the feedback route */}
        <Route
          path="/Dashboard"
          element={
            <RequireRedirect isAllowed={isAllowed}>
              <Dashboard />
            </RequireRedirect>
          }
        />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}