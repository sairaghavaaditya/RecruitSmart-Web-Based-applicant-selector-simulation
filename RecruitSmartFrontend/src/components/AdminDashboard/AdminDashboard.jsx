import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import { useAuth } from "../AuthContext";
import JobList from "./JobList";
import CandidatesPerformance from './CandidatesPerformance.jsx'


const AdminDashboard = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [showAvailableJobs, setShowAvailableJobs] = useState(false);
  const [activePage, setActivePage] = useState("createJobs");
  const [name, setName] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [areaOfExpertise, setAreaOfExpertise] = useState("");
  const navigate = useNavigate();

  const {authState,logout } = useAuth();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin-dashboard/list-job-posts/")
      .then((response) => response.json())
      .then((data) => setJobPosts(data))
      .catch((error) => console.error("Error fetching job posts:", error));
  }, []);

  
  const handleLogout = () => {
    // Clear session or token (if using JWT or any session-based authentication)
     // Or sessionStorage
     logout();
    // Redirect to login page using navigate
    navigate("/adminlogin"); // This will navigate to the login page
  };
  const handleCreateJobPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("end_date", endDate);

    try {
      const response = await fetch("http://127.0.0.1:8000/admin-dashboard/create-job-post/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create job post.");
      }

      const data = await response.json();
      setMessage(data.message || "Job post created successfully!");
      setJobPosts([
        ...jobPosts,
        {
          id: data.job_post_id,
          title,
          description,
          location,
          end_date: endDate,
        },
      ]);
      setTitle("");
      setDescription("");
      setLocation("");
      setEndDate("");
    } catch (error) {
      console.error("Error creating job post:", error);
      setMessage(error.message || "Failed to create job post.");
    }
  };

  const handleUploadSelectedUser = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("discipline", discipline);
    formData.append("area_of_expertise", areaOfExpertise);
  
    // Debugging the CSRF token retrieval
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    if (!csrfTokenMeta) {
      console.error("CSRF token not found!");
      return;
    }
    const csrfToken = csrfTokenMeta.getAttribute('content');
    console.log("CSRF token:", csrfToken);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/admin-dashboard/upload-selected-user/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken, // Include CSRF token in request headers
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload selected user data.");
      }
  
      const data = await response.json();
      setMessage(data.message || "Selected user uploaded successfully!");
      setName("");
      setDiscipline("");
      setAreaOfExpertise("");
    } catch (error) {
      console.error("Error uploading selected user data:", error);
      setMessage(error.message || "Failed to upload selected user data.");
    }
  };
  

  const renderContent = () => {
    switch (activePage) {
      case "createJobs":
        return (
          <div>
          
      {authState?.username ? (
        <p>Welcome, {authState.username}!</p> // Display username
      ) : (
        <p>Welcome, Admin!</p>
      )}
            <h1>Create Job Post</h1>
            <form onSubmit={handleCreateJobPost} className={styles.jobForm}>
              <div className={styles.formGroup}>
                <label>Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Job Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.deleteButton}>Create Job Post</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        );
      case "selectedUsers":
        return (
          <div>
            <h1>Upload Selected User BioData</h1>
            <form onSubmit={handleUploadSelectedUser} className={styles.userForm}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Discipline</label>
                <input
                  type="text"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Area of Expertise</label>
                <textarea
                  value={areaOfExpertise}
                  onChange={(e) => setAreaOfExpertise(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit">Upload User BioData</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        );
      case "jobList":
        return <JobList />;
      case "CandidatesPerformance":
        return <CandidatesPerformance />;
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2>Admin Dashboard</h2>
        
        <hr />
        <ul>
          <li onClick={() => setActivePage("createJobs")}>Create Jobs</li>
          {/* <li onClick={() => setActivePage("selectedUsers")}>Selected Users</li> */}
          <li onClick={() => setActivePage("jobList")}>Job List</li>
          <li onClick={() => setActivePage("CandidatesPerformance")}>Performance Metrics</li>

          <li onClick={handleLogout}>Sign out</li>
        </ul>
      </aside>

      <div className={styles.mainContent}>{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
