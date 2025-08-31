// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "./ScheduleInterviews.module.css";

// const ScheduleInterviews = () => {
//   const [users, setUsers] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedJob, setSelectedJob] = useState("");
//   const [scheduledTime, setScheduledTime] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/expert-dashboard/get-users/"
//         );
//         setUsers(response.data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     const fetchJobs = async () => {
//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/expert-dashboard/get-jobs/"
//         );
//         setJobs(response.data);
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//       }
//     };

//     fetchUsers();
//     fetchJobs();
//   }, []);

//   const handleSchedule = async (e) => {
//     e.preventDefault();
//     if (!selectedJob || selectedUsers.length === 0 || !scheduledTime) {
//       setMessage("Please fill out all fields.");
//       return;
//     }

//     const data = {
//       job_id: selectedJob,
//       user_ids: selectedUsers,
//       scheduled_time: scheduledTime,
//     };

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/schedule-job/",
//         data
//       );
//       setMessage(response.data.message);
//       setSelectedJob("");
//       setSelectedUsers([]);
//       setScheduledTime("");
//     } catch (error) {
//       setMessage(
//         error.response?.data?.error || "Failed to schedule interviews. Try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSelectAll = () => {
//     if (selectedUsers.length === users.length) {
//       setSelectedUsers([]); // Deselect all
//     } else {
//       setSelectedUsers(users.map((user) => user.id)); // Select all
//     }
//   };

//   const handleCheckboxChange = (userId) => {
//     setSelectedUsers((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId) // Deselect
//         : [...prev, userId] // Select
//     );
//   };

//   return (
//     <div className={styles.scheduleContainer}>
//       <h2 className={styles.title}>Schedule Interviews</h2>
//       <form onSubmit={handleSchedule} className={styles.form}>
//         {/* Search Users */}
//         <div className={styles.formGroup}>
//           <label className={styles.label}>Select Users:</label>
//           <input
//             type="text"
//             placeholder="Search users..."
//             className={styles.searchInput}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//           />
//           <button
//             type="button"
//             onClick={toggleSelectAll}
//             className={styles.selectAllButton}
//           >
//             {selectedUsers.length === users.length ? "Deselect All" : "Select All"}
//           </button>
//           <div className={styles.checklistContainer}>
//             {users
//               .filter(
//                 (user) =>
//                   user.first_name.toLowerCase().includes(searchTerm) ||
//                   user.last_name.toLowerCase().includes(searchTerm) ||
//                   user.email.toLowerCase().includes(searchTerm)
//               )
//               .map((user) => (
//                 <div key={user.id} className={styles.checklistItem}>
//                   <input
//                     type="checkbox"
//                     id={`user-${user.id}`}
//                     checked={selectedUsers.includes(user.id)}
//                     onChange={() => handleCheckboxChange(user.id)}
//                   />
//                   <label htmlFor={`user-${user.id}`}>
//                     {user.first_name} {user.last_name} ({user.email})
//                   </label>
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* Select Job */}
//         <div className={styles.formGroup}>
//           <label htmlFor="jobSelect" className={styles.label}>
//             Select Job:
//           </label>
//           <select
//             id="jobSelect"
//             value={selectedJob}
//             onChange={(e) => setSelectedJob(e.target.value)}
//             className={styles.select}
//             required
//           >
//             <option value="">-- Select Job --</option>
//             {jobs.map((job) => (
//               <option key={job.id} value={job.id}>
//                 {job.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Schedule Time */}
//         <div className={styles.formGroup}>
//           <label htmlFor="scheduledTime" className={styles.label}>
//             Schedule Time:
//           </label>
//           <input
//             type="datetime-local"
//             id="scheduledTime"
//             value={scheduledTime}
//             onChange={(e) => setScheduledTime(e.target.value)}
//             className={styles.input}
//             min={new Date().toISOString().slice(0, 16)} // Enforce only future times
//             required
//           />
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className={`${styles.button} ${loading ? styles.loading : ""}`}
//           disabled={loading}
//         >
//           {loading ? "Scheduling..." : "Schedule Interview"}
//         </button>
//       </form>

//       {/* Message */}
//       {message && <p className={styles.message}>{message}</p>}
//     </div>
//   );
// };

// export default ScheduleInterviews;













import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ScheduleInterviews.module.css';

const ScheduleInterviews = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/expert-dashboard/get-users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/expert-dashboard/get-jobs/');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchUsers();
    fetchJobs();
  }, []);


  const convertISTtoUTC = (istTime) => {
    // First, we need to manually treat the input string as being in IST
    const [datePart, timePart] = istTime.split('T');
    const [hour, minute] = timePart.split(':');
  
    // Create a Date object based on the provided date and time in IST
    const istDate = new Date(`${datePart}T${timePart}:00+05:30`); // adding IST offset
  
    // Return the time in UTC by converting it to an ISO string
    return istDate.toISOString(); // This should convert it to UTC
  };
  
  
  


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Pass the selected user email directly (not in an array)
      console.log(selectedJob)
      console.log(selectedUser)
      console.log(scheduledTime)

      const utcScheduledTime = convertISTtoUTC(scheduledTime);
      console.log("Scheduled Time in UTC:", utcScheduledTime);
      
      const response = await axios.post('http://127.0.0.1:8000/expert-dashboard/schedule-interview/', {
        user_gmail: selectedUser,  // Send the email as a string, not in an array
        job_id: selectedJob,
        scheduled_time: utcScheduledTime,
      });
  
      setMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while scheduling the interview.');
      setLoading(false);
    }
  };
  
  
  

  // Get current date-time in the format required for the datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${date}T${hours}:${minutes}`;
  };

  return (
    <div className={styles.scheduleContainer}>
      <h2 className={styles.title}>Schedule Interviews</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="userSelect" className={styles.label}>
            Select User:
          </label>
          <select
            id="userSelect"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.email}>
                {user.first_name} {user.last_name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobSelect" className={styles.label}>
            Select Job:
          </label>
          <select
            id="jobSelect"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">-- Select Job --</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.command_id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="scheduledTime" className={styles.label}>
            Schedule Time:
          </label>
          <input
            type="datetime-local"
            id="scheduledTime"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className={styles.input}
            min={getCurrentDateTime()} // Enforce only future dates/times
            required
          />
        </div>

        <button
          type="submit"
          className={`${styles.button} ${loading ? styles.loading : ''}`}
          disabled={loading}
        >
          {loading ? 'Scheduling...' : 'Schedule Interview'}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ScheduleInterviews;

