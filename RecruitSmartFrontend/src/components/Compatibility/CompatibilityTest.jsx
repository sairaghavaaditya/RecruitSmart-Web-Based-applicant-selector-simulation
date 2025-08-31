import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./CompatibilityTest.module.css";

const CompatibilityTest = () => {
  const [videoTestPassed, setVideoTestPassed] = useState(false);
  const [voiceTestPassed, setVoiceTestPassed] = useState(false);
  const [currentTest, setCurrentTest] = useState("video"); // "video" or "voice"
  const navigate = useNavigate();
  const { commandId } = useParams(); // Fetch the commandId from URL params
  const videoRef = useRef(null); // Ref for displaying video
  const [userResponse, setUserResponse] = useState(""); // To store user's voice input
  const [isRecording, setIsRecording] = useState(false); // Recording state
  const { command_id } = useParams();

  // Handle video test
  const handleVideoTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setTimeout(() => {
        const videoTracks = stream.getVideoTracks();
        videoTracks.forEach((track) => track.stop());
        setVideoTestPassed(true);
        setCurrentTest("voice");
      }, 5000);
    } catch (error) {
      alert("Video test failed. Please enable your webcam and try again.");
    }
  };

  // Handle voice test
  const handleVoiceTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);

      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserResponse(transcript);
        setIsRecording(false);
        setVoiceTestPassed(true);
        const audioTracks = stream.getAudioTracks();
        audioTracks.forEach((track) => track.stop());
      };

      recognition.onerror = () => {
        alert("Voice recognition failed. Please try again.");
        setIsRecording(false);
      };

      recognition.start();
    } catch (error) {
      alert("Voice test failed. Please enable your microphone and try again.");
    }
  };

  useEffect(() => {
    if (videoTestPassed && voiceTestPassed) {
      alert("All tests passed! Redirecting to the interview page.");
      console.log("Command ID:", commandId);
      navigate(`/InterviewPage/${command_id}`);
    }
  }, [videoTestPassed, voiceTestPassed, navigate, commandId]);

  return (
    <div className={styles.CompatibilityTest}>
      <h1>Interview Prerequisites</h1>
      
      
      <div className={styles.container}>
        {/* Left Container: Compatibility Test */}
        <div className={styles.leftContainer}>
          {currentTest === "video" && (
            <div className={styles.testContainer}>
              <p>Please ensure your webcam and microphone are functioning correctly.</p>
              <h2>Step 1: Video Test</h2>
              <p>Your webcam feed will appear below. The test will complete in 5 seconds.</p>
              <div className={styles.videoContainer}>
                <video ref={videoRef} className={styles.video} autoPlay playsInline></video>
                <br />
                <button onClick={handleVideoTest} className={styles.combutton}>
                  Start Video Test
                </button>
              </div>
            </div>
          )}

          {currentTest === "voice" && (
            <div className={styles.testContainer}>
              <h2>Step 2: Voice Test</h2>
              <p>Please say something when prompted. Your voice input will be displayed below.</p>
              <div className={styles.voiceContainer}>
                {isRecording && <span className={styles.recording}>Recording...</span>}
                <button onClick={handleVoiceTest} className={styles.combutton}>
                  Start Voice Test
                </button>
                {userResponse && (
                  <div className={styles.response}>
                    <h3>Your Response:</h3>
                    <p>{userResponse}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.status}>
            <h3>Test Status:</h3>
            <p>
              Video Test:{" "}
              {videoTestPassed ? (
                <span className={styles.passed}>Passed</span>
              ) : (
                <span className={styles.pending}>Pending</span>
              )}
            </p>
            <p>
              Voice Test:{" "}
              {voiceTestPassed ? (
                <span className={styles.passed}>Passed</span>
              ) : (
                <span className={styles.pending}>Pending</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Container: Interview Instructions */}
        <div className={styles.rightContainer}>
          <h2>Interview Instructions</h2>
            <img
              src="/ai.jpg"
              alt="Interview Instructions"
              className={styles.instructionImage}
            />
          <ol>
            <li>Click on the 'Answer' button to start Answering , 'Use Voice Input' button to give answer with mic and 'Submit Answer' button to submit the answer</li>
            <li>Answer all the questions to generate the final analytics report.</li>
            <li>Do not worry if the transcription text is not accurate; we will improve it before generating the analytics report.</li>
            <li>Use your headphones for a better experience.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityTest;



