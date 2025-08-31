import React from 'react';
import styles from "./Dashboard.module.css";
import { useNavigate } from 'react-router-dom';



function Dashboard() {
    const navigate = useNavigate();

    const goToAdmin = () => navigate('/adminlogin');
    const goToUserLogin = () => navigate('/userlogin/');
    const goToexpert = () => navigate('/expertLogin/');
    

    const handleNavigate = () => {
        navigate('/'); // Navigate to the target page
    };

    return (
        <div className={styles.page}>
            {/* Left Container */}
            <div className={styles.leftContainer}>
                <h2>Welcome to <br />Recruitsmart!</h2>
                <p> "Elevate Your Expertise,<br /> Enhance Your Career"</p>
            </div>

            {/* Right Container */}
            <div className={styles.rightContainer}>
                <div className={styles.child}>
                    <h3>I am </h3>

                    {/* Dashboard Image Buttons */}
                    <div className={styles.imageButtonContainer}>
                        <div className={`${styles.imageButton} ${styles.adminButton}`} onClick={goToAdmin}>
                        {/* <img src="/adminimg.jpg" alt="Admin" /> */}
                        </div>
                        <div className={`${styles.imageButton} ${styles.userButton}`} onClick={goToexpert}>
                        {/* <img src="/user.jpg" alt="User" /> */}
                        </div>
                        <div className={`${styles.imageButton} ${styles.userButton}`} onClick={goToUserLogin}>
                        {/* <img src="/adminimg.jpg" alt="expert" /> */}
                        </div>
                    </div>
                        <div className={styles.imgname}>
                            <h3>Admin</h3>
                            <h3>Expert</h3>
                            <h3>Candidate</h3>
                            

                        </div>
                        <button type="button" className={styles.Dashboardbutton} onClick={handleNavigate}>
                                Back
                            </button>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
