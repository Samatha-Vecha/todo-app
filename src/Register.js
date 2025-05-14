import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import "./Login.css"; // Reuse the same styles

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/;

  const handleRegister = async (e) => {
  e.preventDefault();

  if (!fullName || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (!emailRegex.test(email)) {
    alert("Invalid email format.");
    return;
  }

  if (!passwordRegex.test(password)) {
    alert("Password must be at least 6 characters and include a number and a letter.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: fullName,
      email,
      uid: user.uid,
    });

    alert("User registered successfully!");
    navigate("/"); // Go to login
  } catch (error) {
    console.error(error.message);

    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered. Please login.");
      navigate("/"); // Redirect to login
    } else {
      alert("Registration failed. Please try again.");
    }
  }
};

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>📝 TODO-List</h2>
        <p>Create Account</p>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <a href="/">Login here</a>
        </p>
      </div>
      <div className="login-image">{/* Optional image */}</div>
    </div>
  );
};

export default Register;
