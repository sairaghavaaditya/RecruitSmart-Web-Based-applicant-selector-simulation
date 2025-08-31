
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from './UserDashboard.module.css';
// import { useAuth } from '../Auth/UserAuthContext'

// const UserDashboard = () => {
//     const [jobs, setJobs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const {authState,logout } = useAuth();
//     useEffect(() => {
//         const fetchJobs = async () => {  
//             try {
//                 const response = await axios.get("http://localhost:8000/api/jobs/",{
//                     params: { gmail: authState.username },
//                 });
//                 setJobs(response.data);
//             } catch (error) {
//                 console.error("Error fetching job posts:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchJobs();
//     }, []);

//     const handleLogout = () => {
//          logout();
//         navigate("/adminlogin"); 
//       };

//     const handleTakeInterview = (commandId) => {
//         navigate(`/CompatibilityTest/${commandId}`);
//     };

//     return (
//         <div className={styles.dashboardContainer}>
//             <div className={styles.sidebar}>
//                 <h2 className={styles.sidebarTitle}>User Dashboard</h2>
//                 <ul className={styles.sidebarNav}>
//                     <li className={styles.sidebarItem}>
//                         <a href="#" className={styles.sidebarLink}>Dashboard</a>
//                     </li>
//                     <li className={styles.sidebarItem}>
//                         <a href="#" className={styles.sidebarLink}>Profile</a>
//                     </li>
//                     <li className={styles.sidebarItem}>
//                         <a href="/userlogin" className={styles.sidebarLink} onClick={handleLogout}>Logout</a>
//                     </li>
//                 </ul>
//             </div>
            
//             <div className={styles.mainContent}>
//             <p>Welcome, {authState.username}!</p>
//                 <div className={styles.header}>
//                     <h1 className={styles.headerTitle}>Welcome to the Job Portal</h1>
//                 </div>
                
//                 <div className={styles.jobsSection}>
//                     <h3 className={styles.jobsSectionTitle}>Available Jobs</h3>
                    
//                     {loading ? (
//                         <p className={styles.loadingMessage}>Loading jobs...</p>
//                     ) : jobs.length === 0 ? (
//                         <div className={styles.noJobsMessage}>
//                             No jobs available at the moment.
//                         </div>
//                     ) : (
//                         <ul className={styles.jobList}>
//                             {jobs.map((job) => (
//                                 <li key={job.id} className={styles.jobCard}>
//                                     <h4 className={styles.jobTitle}>{job.title}</h4>
//                                     <p className={styles.jobDescription}>{job.description}</p>
//                                     <span className={styles.jobDate}>
//                                         Posted on: {new Date(job.created_at).toLocaleDateString()}
//                                     </span>
//                                     <br />
//                                     <button
//                                         className={styles.takeInterviewBtn}
//                                         onClick={() => handleTakeInterview(job.command_id)}
//                                     >
//                                         Take Interview
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserDashboard;






import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";
import { useAuth } from "../Auth/UserAuthContext";
import MySimulations from "./MySimulations";
import MyProfile from "./MyProfile";

const UserDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [activePage, setActivePage] = useState("simulation");

    const handleLogout = () => {
        logout();
        navigate("/userlogin");
    };

    const renderContent = () => {
        switch (activePage) {
            case "simulation":
                return <MySimulations />;
            case "profile":
                return <MyProfile />;
            default:
                return <p>Select an option from the sidebar.</p>;
        }
    };

    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
                <h2>User Dashboard</h2>
                <hr className={styles.divider} />
                <ul className={styles.navList}>
                    <li
                        className={`${styles.navItem} ${
                            activePage === "simulation" ? styles.active : ""
                        }`}
                        onClick={() => setActivePage("simulation")}
                    >
                        My Simulations
                    </li>
                    <li
                        className={`${styles.navItem} ${
                            activePage === "profile" ? styles.active : ""
                        }`}
                        onClick={() => setActivePage("profile")}
                    >
                        Profile
                    </li>
                    <li className={styles.navItem} onClick={handleLogout}>
                        Sign out
                    </li>
                </ul>
            </aside>
            <main className={styles.mainContent}>{renderContent()}</main>
        </div>
    );
};

export default UserDashboard;
