// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // For navigation after signup

// const UserSignup = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     mobileNumber: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const navigate = useNavigate(); // React Router navigation

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if passwords match
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match. Please try again.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8000/api/signup/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         alert("Signup successful! Redirecting to login page...");
//         navigate("/userlogin"); // Redirect to the login page
//       } else {
//         const errorData = await response.json();
//         alert(`Signup failed: ${errorData.error}`);
//       }
//     } catch (error) {
//       console.error("Error during signup:", error);
//       alert("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Signup</h2>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <input
//           type="text"
//           name="firstName"
//           placeholder="First Name"
//           value={formData.firstName}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <input
//           type="text"
//           name="lastName"
//           placeholder="Last Name"
//           value={formData.lastName}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <input
//           type="text"
//           name="mobileNumber"
//           placeholder="Mobile Number"
//           value={formData.mobileNumber}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <button type="submit" style={styles.button}>
//           Signup
//         </button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "400px",
//     margin: "50px auto",
//     padding: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "10px",
//     textAlign: "center",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   input: {
//     marginBottom: "15px",
//     padding: "10px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   button: {
//     padding: "10px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     border: "none",
//     backgroundColor: "#4CAF50",
//     color: "#fff",
//     cursor: "pointer",
//   },
// };

// export default UserSignup;


// import React from 'react';
// import styles from './Signup-Page.module.css';


// function SignupPage() {
//     return (
//         <div className={styles.page}>
//             {/* Left Container */}
//             <div className={styles.leftContainer}>
//             <h2>Welcome to <br/>Recruitsmart!</h2>
//             <p> "Elevate Your Expertise,<br/> Enhance Your Career"</p>
//             </div>

//             {/* Right Container */}
//             <div className={styles.rightContainer}>
//                 <div className={styles.child}>
//                     <h3>RecruitSmart</h3>
//                     <h3>Sign Up</h3>

//                     <form className={styles.form}>
//                         <div className={styles.inputContainer}>
//                             <label htmlFor="username" className={styles.label}>
//                                 Username
//                             </label>
//                             <input
//                                 type="text"
//                                 id="username"
//                                 name="username"
//                                 placeholder="Enter your username"
//                                 className={styles.input}
//                                 required
//                             />
//                         </div>

//                         <div className={styles.inputContainer}>
//                             <label htmlFor="password" className={styles.label}>
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 placeholder="Enter your password"
//                                 className={styles.input}
//                                 required
//                             />
//                         </div>

//                         <div className={styles.inputContainer}>
//                             <label htmlFor="email" className={styles.label}>
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 placeholder="Enter your email"
//                                 className={styles.input}
//                                 required
//                             />
//                         </div>

//                         <div className={styles.inputContainer}>
//                             <label htmlFor="firstName" className={styles.label}>
//                                 First Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="firstName"
//                                 name="firstName"
//                                 placeholder="Enter your first name"
//                                 className={styles.input}
//                                 required
//                             />
//                         </div>

//                         <div className={styles.inputContainer}>
//                             <label htmlFor="lastName" className={styles.label}>
//                                 Last Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="lastName"
//                                 name="lastName"
//                                 placeholder="Enter your last name"
//                                 className={styles.input}
//                                 required
//                             />
//                         </div>

//                         <div className={styles.inputContainer}>
//                             <label htmlFor="address" className={styles.label}>
//                                 Address
//                             </label>
//                             <input
//                                 type="text"
//                                 id="address"
//                                 name="address"
//                                 placeholder="Enter your address"
//                                 className={styles.input}
//                                 required
//                             />
//                         </div>

//                         <div className={styles.submitContainer}>
//                             <button type="submit" className={styles.button}>
//                                 Register
//                             </button>
//                         </div>
//                     </form>

//                     <h3>
//                         Already have an account?{' '}
//                         <a href="./userlogin" className={styles.loginLink}>
//                             Login
//                         </a>
//                     </h3>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SignupPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './UserSignup.module.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Signup successful! Redirecting to login page...");
        navigate("/userlogin");
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.page}>
      {/* Left Container */}
      <div className={styles.leftContainer}>
        <h2>Welcome to <br/>Recruitsmart!</h2>
        <p> "Elevate Your Expertise,<br/> Enhance Your Career"</p>
      </div>

      {/* Right Container */}
      <div className={styles.rightContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.subheading}>
            <i className="fa-brands fa-servicestack"></i> RecruitSmart
          </h3>
          <h2 className={styles.heading}>Signup</h2>
          <div className={styles.inputGroup}>
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <i className="fa-solid fa-phone"></i>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <i className="fa-regular fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Register
          </button>
          <p className={styles.message}>
            Already have an account? <a href="/userlogin" className={styles.link}>Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

