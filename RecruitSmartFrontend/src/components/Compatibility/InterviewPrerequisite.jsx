import React, { useEffect } from 'react';
import styles from './InterviewPrerequisite.module.css';

const InterviewPrerequisite = () => {
  useEffect(() => {
    // Get the video element
    const video = document.getElementById('webcamVideo');

    // Request access to the webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Set the video source to the webcam stream
          video.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
        });
    }
  }, []);

  const goBack = () => {
    window.location.href = '/candidate/simulation/my simulation page/my-simulations.html';
  };

  const startInterview = () => {
    window.location.href =
      '/candidate/simulation/my simulation page/start simulation mage/simulation session/simulation-session.html';
  };

  return (
    <div>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>DRDO Simulation</div>
      </nav>

      {/* Main Content */}
      <div className={styles.prerequisiteContainer}>
        <h1>Interview Prerequisite</h1>

        <div className={styles.contentSections}>
          {/* Compatibility Section */}
          <div className={styles.compatibilitySection}>
            <h2>Compatibility Test</h2>
            <div className={styles.compatibilityStatus}>
              <video id="webcamVideo" autoPlay playsInline className={styles.webcamVideo}></video>
              <ul>
                <li>✔️ Check completed. Your browser is compatible.</li>
                <li>✔️ Test completed. Microphone is enabled.</li>
                <li>✔️ Test completed. Camera is enabled.</li>
              </ul>
            </div>
          </div>

          {/* Instructions Section */}
          <div className={styles.instructionsSection}>
            <h2>Interview Instructions</h2>
            <img
              src="../images/Screenshot 2024-09-07 182826.png"
              alt="Interview Instructions"
              className={styles.instructionImage}
            />
            <ol>
              <li>Click on the 'Answer' button to start recording and 'End Answer' button to move to the next question.</li>
              <li>Answer all the questions to generate the final analytics report.</li>
              <li>Do not worry if the transcription text is not accurate, we will improve that before generating the analytics report.</li>
              <li>Use your headphones for a better experience.</li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.goBackBtn} onClick={goBack}>
            Go Back
          </button>
          <button className={styles.startInterviewBtn} onClick={startInterview}>
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrerequisite;
