

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MySimulations.module.css";
import { useAuth } from "../Auth/UserAuthContext";
import { useNavigate } from "react-router-dom";

const MySimulations = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { authState, logout } = useAuth();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/jobs/", {
                    params: { gmail: authState.username },
                });
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching job posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [authState.username]);

    const handleTakeInterview = (commandId) => {
        navigate(`/CompatibilityTest/${commandId}`);
    };

    // Helper function to determine interview state
    const getInterviewState = (scheduledTime) => {
        const currentTime = new Date();
        const interviewStartTime = new Date(scheduledTime); // Convert the string to a Date object
        const timeDifference = currentTime.getTime() - interviewStartTime.getTime(); // Difference in milliseconds

        if (currentTime < interviewStartTime) {
            return "upcoming"; // Interview is in the future
        } else if (timeDifference > 10 * 60 * 1000) {
            return "expired"; // More than 10 minutes past the scheduled time
        } else {
            return "available"; // Interview is available
        }
    };

    return (
        <div className={styles.container}>
            <h1>Welcome!</h1>
            {loading ? (
                <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
                <p>No jobs available at the moment.</p>
            ) : (
                <ul className={styles.jobList}>
                    {jobs.map((job) => {
                        const interviewState = getInterviewState(job.scheduled_time);

                        return (
                            <li key={job.id} className={styles.jobCard}>
                                <h4>{job.title}</h4>
                                <p>{job.description}</p>
                                <p>Posted on: {new Date(job.created_at).toLocaleDateString()}</p>
                                <p>Scheduled Time: {new Date(job.scheduled_time).toLocaleString()}</p>

                                {/* Render the appropriate message or button based on the interview state */}
                                {interviewState === "upcoming" ? (
                                    <p className={`${styles.interviewMessage} ${styles.upcoming}`}>
                                        Your interview will start on {new Date(job.scheduled_time).toLocaleString()}.
                                    </p>
                                ) : interviewState === "expired" ? (
                                    <p className={`${styles.interviewMessage} ${styles.expired}`}>
                                        This interview is no longer accessible as the scheduled time has passed.
                                    </p>
                                ) : (
                                    <button
                                        className={styles.takeInterviewBtn}
                                        onClick={() => handleTakeInterview(job.command_id)}
                                    >
                                        Take Interview
                                    </button>
                                )}

                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default MySimulations;


