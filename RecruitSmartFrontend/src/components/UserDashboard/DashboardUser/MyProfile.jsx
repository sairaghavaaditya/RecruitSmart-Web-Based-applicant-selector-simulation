import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Auth/UserAuthContext";
import styles from "./MyProfile.module.css";

const MyProfile = () => {
  const { authState } = useAuth(); // Get auth state from context
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      if (!authState?.username) {
        throw new Error("No username found in auth state.");
      }

      console.log("Fetching user profile for:", authState.username);

      const response = await axios.get("http://localhost:8000/api/user-profile", {
        params: { gmail: authState.username }, // Dynamic email from auth state
      });

      console.log("Profile data received:", response.data);
      setProfileData(response.data); // Update state with profile data
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.message); // Store the error message
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile on component mount
  }, [authState.username]);

  if (loading) {
    return <p className={styles.loading}>Loading profile...</p>;
  }

  if (error) {
    return (
      <p className={styles.error}>
        Error loading profile data: {error}. Please try again.
      </p>
    );
  }

  if (!profileData) {
    return (
      <p className={styles.error}>
        No profile data available. Please check your account settings.
      </p>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.header}>My Profile</h1>
        <div className={styles.avatarWrapper}>
          <img
            src={`https://ui-avatars.com/api/?name=${profileData.first_name}+${profileData.last_name}&background=1E88E5&color=FFFFFF&size=128`}
            alt="User Avatar"
            className={styles.avatar}
          />
        </div>
        <div className={styles.details}>
          <p>
            <strong>Name:</strong> {profileData.first_name} {profileData.last_name}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Mobile Number:</strong> {profileData.mobile_number}
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.editButton}
            onClick={() => console.log("Edit Profile Clicked")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
