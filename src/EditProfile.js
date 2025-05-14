// src/pages/EditProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import { auth, db } from "./firebase"; // Adjust path to your firebase.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";


const EditProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
  const fetchUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPassword(""); // leave password empty for security
    } else {
      console.log("No such user!");
    }
  };

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchUserData(user.uid);
    } else {
      console.log("User not signed in");
      navigate("/login");
    }
  });

  return () => unsubscribe();
}, [navigate]);
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!name || !email || !password) {
    alert("All fields are required.");
    return;
  }

  try {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      name,
      email,
      // Do NOT store password in Firestore in plaintext
    });

    alert("Profile updated successfully!");
    navigate("/home");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile");
  }
};


  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <h2>Edit Profile</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
