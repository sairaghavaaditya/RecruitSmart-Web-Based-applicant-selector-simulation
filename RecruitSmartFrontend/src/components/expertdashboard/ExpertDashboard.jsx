import React, { useState } from 'react';
import ExpertUpload from './ExpertUpload';
import ScheduleInterviews from './ScheduleInterviews';
import styles from './ExpertDashboard.module.css';

const ExpertDashboard = () => {
    const [activeTab, setActiveTab] = useState('uploadQuestions');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Expert Dashboard</h2>
                <hr className={styles.divider} />
                <ul className={styles.navList}>
                    <li
                        className={`${styles.navItem} ${
                            activeTab === 'uploadQuestions' ? styles.active : ''
                        }`}
                        onClick={() => handleTabClick('uploadQuestions')}
                    >
                        Job Questions Upload
                    </li>
                    <li
                        className={`${styles.navItem} ${
                            activeTab === 'scheduleInterviews' ? styles.active : ''
                        }`}
                        onClick={() => handleTabClick('scheduleInterviews')}
                    >
                        Schedule Interviews
                    </li>
                    <li className={styles.navItem}>
                        <a href="/" className={styles.logoutLink}>
                            Sign out
                        </a>
                    </li>
                </ul>
            </div>

            <div className={styles.mainContent}>
                {activeTab === 'uploadQuestions' && <ExpertUpload />}
                {activeTab === 'scheduleInterviews' && <ScheduleInterviews />}
            </div>
        </div>
    );
};

export default ExpertDashboard;
