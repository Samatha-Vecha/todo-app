// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user's name from localStorage
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words.map((w) => w[0].toUpperCase()).join("").slice(0, 2);
  };

  const handleLogout = () => {
    alert("Logged out");
    localStorage.removeItem("user");
    window.location.href = "/";
};

  const handleEditProfile = () => {
    navigate("/edit-profile"); // redirect to edit profile page
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">To-Do List APP</div>

      <div
            className="navbar-profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            >
            <div className="profile-initials">{getInitials(userName)}</div>
            <div className={`arrow-icon ${dropdownOpen ? "open" : ""}`}>▼</div>

            {dropdownOpen && (
                <div className="dropdown">
                <div className="dropdown-item" onClick={handleEditProfile}>
                    Edit Profile
                </div>
                <div className="dropdown-item" onClick={handleLogout} style={{color:"red"}}>
                    Logout ➡
                </div>
                </div>
            )}
        </div>

    </nav>
  );
};

export default Navbar;
