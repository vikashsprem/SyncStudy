import React from "react";

function UserProfile() {
  return (
    <div className="user-profile">
      <img className="profile-pic" src="profile.png" alt="Profile" />
      <div className="profile-info">
        <h2>Student</h2>
        <button className="dashboard-btn">Dashboard</button>
      </div>
    </div>
  );
}

export default UserProfile;
