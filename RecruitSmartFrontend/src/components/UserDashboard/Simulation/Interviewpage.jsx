
import React, { useState, useEffect, useRef,useCallback } from "react";
import { useParams,useNavigate } from "react-router-dom"; // Import useParams
import axios from "axios";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import styles from './InterviewPage.module.css';
import { useAuth } from '../Auth/UserAuthContext'


function InterviewPage() {
    const { command_id } = useParams(); // Get command_id from URL params
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [submitMessage, setSubmitMessage] = useState("");
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [answerTimer, setAnswerTimer] = useState(30); // 30 seconds for "Answer the Question"
    const [submitTimer, setSubmitTimer] = useState(60); // 1 minute to submit after clicking "Answer the Question"
    const [isAnswering, setIsAnswering] = useState(false);
    const [score, setScore] = useState(0);
    const webcamRef = useRef(null);
    

    const [alertCount, setAlertCount] = useState(0);

    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);
    const navigate = useNavigate();
    
    const [model, setModel] = useState(null);
    const modelLoadingRef = useRef(false);

    const answerTimerRef = useRef(null);
    const submitTimerRef = useRef(null);


    const {authState,logout } = useAuth();
    const [alertShown, setAlertShown] = useState(false);
    
     
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
 

    
    // Fetch the first question or the next question
    const fetchQuestion = async (id = null) => {
      try {
          setLoading(true);
          setQuestion(null); // Clear the current question while fetching the new one
          const url = id
          ? `http://127.0.0.1:8000/api/fetch-next-question/?current_question_id=${id}&command_id=${command_id}`
          : `http://127.0.0.1:8000/api/fetch-next-question/?&command_id=${command_id}`;
          const response = await axios.get(url);
          const data = response.data;
  
          if (data.message === "No more questions available.") {
              setQuestion(null);
              navigate('/feedback', { 
                state: { 
                    interviewCompleted: true 
                } 
              });
          } else {
              setQuestion(data);
              setCurrentQuestionId(data.id);
              resetTimers();
              speakText(data.question);
          }
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };
  

    useEffect(() => {
        fetchQuestion();

        // Timer for answering the question
        answerTimerRef.current = setInterval(() => {
            setAnswerTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(answerTimerRef.current);
                    handleSkipQuestion(); // Skip to next question if not answered within 30 seconds
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(answerTimerRef.current);
    }, []);

    const resetTimers = () => {
      if (answerTimerRef.current) clearInterval(answerTimerRef.current);
      if (submitTimerRef.current) clearInterval(submitTimerRef.current);
  
      setAnswerTimer(120);
      setSubmitTimer(180);
      setIsAnswering(false);
  
      // Restart answer timer
      answerTimerRef.current = setInterval(() => {
          setAnswerTimer((prev) => {
              if (prev <= 1) {
                  clearInterval(answerTimerRef.current);
                  handleSkipQuestion(); // Skip question if timer runs out
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };
  

    const startAnswering = () => {
        setIsAnswering(true);
        if (answerTimerRef.current) clearInterval(answerTimerRef.current);

        // Start submit timer
        submitTimerRef.current = setInterval(() => {
            setSubmitTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(submitTimerRef.current);
                    handleSkipQuestion(); // Skip question if not submitted within 1 minute
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleVoiceInput = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.interimResults = false;
    
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserAnswer((prevAnswer) => `${prevAnswer} ${transcript}`); // Append the new text
        };
    
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };
    
        recognition.start();
    };
    


const handleSubmit = async () => {
    if (!userAnswer.trim()) {
        alert("Please provide an answer before submitting.");
        return;
    }

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/api/submit-response/",
            {
                question_id: currentQuestionId,
                user_answer: userAnswer,
                user_email:authState.username,
            }
        );

        if (response.status === 200) {
            const data = response.data;
            setSubmitMessage(data.message || "Answer submitted successfully!");
            setScore(data.score); // Set score from the response
            setUserAnswer("");
            fetchQuestion(currentQuestionId); // Fetch the next question
        } else {
            setSubmitMessage("An error occurred. Please try again.");
        }
    } catch (err) {
        console.error("Error submitting response:", err); // Log the error for debugging
        setSubmitMessage(
            err.response?.data?.error || "A network error occurred. Please check your connection."
        );
    } finally {
        if (submitTimerRef.current) clearInterval(submitTimerRef.current);
    }
};




const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1; // Adjust rate as needed
    synth.speak(utterance);
};
  
  
  const handleSkipQuestion = () => {
      setUserAnswer("");
      setSubmitMessage("");
      setScore(0);
      fetchQuestion(currentQuestionId); // Fetch the next question
  };
  

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>Error: {error}</h1>;


    const pageStyle = {
        backgroundColor: '#F0F8FF', // Change this to your desired color
        minHeight: '100vh', // Ensures the background covers the full height
        padding: '20px', // Optional padding
      };
    return (
        <div className={styles.container} style={pageStyle}>
            <h1 className={styles.header}>RecruitSmart</h1>
    
            <div className={styles.imageContainer}>
                <img
                    className={styles.image}
                    src="/ai.jpg"
                    alt="Interview Visualization"
                />
            </div>
    
            <div className={styles.content}>
                {/* Left Section - Webcam (Top Right) */}
                <div className={styles.webcamContainer}>
                    <h2 className={styles.webcamHeader}>Webcam Preview</h2>
                    <Webcam
                        className={styles.webcam}
                        audio={false}
                        videoConstraints={{
                            width: 400,
                            height: 300,
                            facingMode: "user",
                        }}
                    />
                </div>
    
                {/* Right Section - Question and Answer (Below the Image) */}
                <div className={styles.card}>
                    <div className={styles.timerContainer}>
                        <p>Time Left to Answer: {formatTime(answerTimer)}   Time Left to Submit: {formatTime(submitTimer)}</p>
                    </div>
    
                    {question && (
                        <>
                            <h2 className={styles.question}>{question.question}</h2>
                            <p className={styles.difficulty}>
                                <strong>Difficulty:</strong> {question.difficulty}
                            </p>
                            <textarea
                                className={styles.textarea}
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                rows="4"
                            />
                            <div className={styles.buttonContainer}>
                            <button
                            className={`${styles.intbutton}`}
                            onClick={startAnswering}
                            disabled={isAnswering}
                        >
                            Answer the Question
                        </button>
                        <button
                            className={`${styles.intbutton}`}
                            onClick={handleVoiceInput}
                            disabled={!isAnswering}
                        >
                            Use Voice Input
                        </button>
                        <button
                            className={`${styles.intbutton}`}
                            onClick={handleSubmit}
                            disabled={!isAnswering}
                        >
                            Submit Answer
                        </button>
                        <button
                            className={`${styles.intbutton}`}
                            onClick={handleSkipQuestion}
                        >
                            Skip Question
                        </button>

                            </div>
                        </>
                    )}
                </div>
            </div>
    
            {submitMessage && <p className={styles.score}>{submitMessage}</p>}
            {/* {score && <p className={styles.score}>{score}</p>} */}
        </div>
    );
    
}

export default InterviewPage;









