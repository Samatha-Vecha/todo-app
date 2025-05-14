import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Optionally, fetch user display name from Firebase if available
    const name = user.displayName || "User"; // fallback if no displayName is set

    // Save user name and email to localStorage
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", user.email);

    navigate("/home"); // Go to home/dashboard
  } catch (error) {
    console.error(error.message);
    alert("Invalid email or password.");
  }
};


  return (
    <div className="login-container">
      <div className="login-form">
        <h2>📝 TODO-List</h2>
        <p>Login</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="remember">
            <input type="checkbox" /> Remember Me
          </div>
          <button type="submit">Log In</button>
        </form>

        <a href="#">Forgot your password?</a>
        <p style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <span
            className="register-link"
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer" }}
          >
            Register here
          </span>
        </p>
      </div>

      <div className="login-image">
        {/* Optional image goes here */}
      </div>
    </div>
  );
};

export default Login;
