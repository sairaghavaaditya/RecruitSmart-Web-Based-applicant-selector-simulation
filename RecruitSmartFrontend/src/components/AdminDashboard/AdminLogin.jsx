import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminLogin.module.css"; // Import CSS module
import { useAuth } from "../AuthContext";

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    
    const handleNavigate = () => {
        navigate('/'); // Navigate to the target page
      };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/admin-dashboard/admin/login/", formData);
            console.log(response.data)
            if (response.status === 200) {
                login({ token: response.data.token,username: response.data.username, role: "admin" });
                navigate("/admin-dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div className={styles.page}>
            {/* Right Container */}
            <div className={styles.rightContainer}>
                <h2>Welcome to <br /> Recruitsmart!</h2>
                <p>"Elevate Your Expertise,<br /> Enhance Your Career"</p>
            </div>

            {/* Left Container */}
            <div className={styles.leftContainer}>
                <div className={styles.child}>
                    <h3>Admin Login</h3>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputContainer}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div >
                        <div className={styles.buttonContainer}>
                        <button type="button" className={styles.button} onClick={handleNavigate} >
                            Back
                        </button>
                        <button type="submit" className={styles.button} >
                            Login
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;