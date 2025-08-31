// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from './userlogin.module.css';
// import { useAuth } from '../Auth/UserAuthContext';

// const UserLogin = () => {
//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });
//     const [error, setError] = useState("");
//     const navigate = useNavigate();
//     const { login } = useAuth();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };


//     const handleNavigate = () => {
//         navigate('/'); // Navigate to the target page
//       };
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");

//         try {
//             const response = await axios.post("http://localhost:8000/api/login/", formData);
//             if (response.status === 200) {
//                 // Redirect to the dashboard if login is successful
//                 login({ token: response.data.token, username: response.data.username,role: "candidate" });
//                 navigate("/UserDashboard");
//             }
//         } catch (err) {
//             setError(err.response?.data?.error || "Something went wrong.");
//         }
//     };

//     return (
//         <div className={styles.page}>
//             {/* Left Container */}
//             <div className={styles.leftContainer}>
//                 <h2>Welcome Back!</h2>
//                 <p>Here, you can include an image or additional text in the future.</p>
//             </div>

//             {/* Right Container */}
//             <div className={styles.rightContainer}>
//                 <div className={styles.child}>
//                     <h3>RecruitSmart</h3>
//                     <h3>Sign In</h3>

//                     {error && <p className={styles.errorMessage}>{error}</p>}

//                     <form className={styles.form} onSubmit={handleSubmit}>
//                         <div className={styles.inputContainer}>
//                             <label htmlFor="email" className={styles.label}>
//                                 <span className={styles.icon}>📧</span>Email
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 placeholder="Enter your email"
//                                 className={styles.input}
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>

//                         <div className={styles.inputContainer}>
//                             <label htmlFor="password" className={styles.label}>
//                                 <span className={styles.icon}>🔒</span>Password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 placeholder="Enter your password"
//                                 className={styles.input}
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>

//                         <div className={styles.loginContainer}>
//                         <div className={styles.buttonContainer}>
//                         <button type="submit" className={styles.button} onClick={handleNavigate} >
//                             Back
//                         </button>
//                         <button type="submit" className={styles.button} >
//                             Login
//                         </button>
//                         </div>
//                             <a href="/forgotpw" className={styles.forgotPw}>
//                                 Forgot Password?
//                             </a>
//                         </div>
//                     </form>

//                     <h3>
//                         Don't have an Account?{' '}
//                         <a href="/usersignup" className={styles.registerLink}>
//                             Register
//                         </a>
//                     </h3>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserLogin;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './userlogin.module.css';
import { useAuth } from '../Auth/UserAuthContext';

const UserLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNavigate = () => {
        navigate('/'); // Navigate to the target page
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/login/", formData);
            if (response.status === 200) {
                // Redirect to the dashboard if login is successful
                login({ token: response.data.token, username: response.data.username, role: "candidate" });
                navigate("/UserDashboard");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.rightContainer}>
                <h3>RecruitSmart</h3>
                <h3>Sign In</h3>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="email" className={styles.label}>
                            <span className={styles.icon}>📧</span>Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className={styles.input}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="password" className={styles.label}>
                            <span className={styles.icon}>🔒</span>Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className={styles.input}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.loginContainer}>
                        <div className={styles.buttonContainer}>
                            <button type="button" className={styles.button} onClick={handleNavigate}>
                                Back
                            </button>
                            <button type="submit" className={styles.button}>
                                Login
                            </button>
                        </div>
                        <a href="/forgotpw" className={styles.forgotPw}>
                            Forgot Password?
                        </a>
                    </div>
                </form>

                <h3>
                    Don't have an Account?{' '}
                    <a href="/usersignup" className={styles.registerLink}>
                        Register
                    </a>
                </h3>
            </div>
        </div>
    );
}

export default UserLogin;