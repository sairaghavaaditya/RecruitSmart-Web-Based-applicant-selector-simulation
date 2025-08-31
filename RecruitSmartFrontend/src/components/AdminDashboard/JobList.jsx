import React, { useEffect, useState } from "react";
import styles from "./JobList.module.css";

const JobList = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin-dashboard/list-job-posts/")
      .then((response) => response.json())
      .then((data) => setJobPosts(data))
      .catch((error) => console.error("Error fetching job posts:", error));
  }, []);

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/admin-dashboard/delete-job-post/${jobId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete job post.");
      }

      setMessage("Job post deleted successfully!");
      setJobPosts(jobPosts.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job post:", error);
      setMessage(error.message || "Failed to delete job post.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Job Posts</h1>
        {message && <p className={styles.message}>{message}</p>}
      </header>
      <div className={styles.jobList}>
        {jobPosts.length === 0 ? (
          <p className={styles.noJobs}>No job posts available.</p>
        ) : (
          jobPosts.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobDetails}>
                <h2>{job.title}</h2>
                <p>{job.description}</p>
                <span className={styles.date}>
                  Posted on: {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteJob(job.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobList;
