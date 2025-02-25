import React, { useState } from "react";
import { useAuth } from "../security/AuthContext";
import Avatar from "@mui/material/Avatar";
import ProfileImage from "../assets/dummy-profile.png";

const Profile = () => {
  const { handleLogout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative inline-block">
      <Avatar 
        alt="Profile" 
        src={ProfileImage} 
        className="cursor-pointer" 
        onClick={toggleDropdown}
      />
      <div
        className={`absolute right-0 top-12 w-48 bg-[#1f2937] rounded-md shadow-md z-10 ${
          isDropdownOpen ? "block" : "hidden"
        }`}
      >
        <ul>
          <li className="py-2 px-4 hover:bg-slate-500 cursor-pointer">Profile</li>
          <li className="py-2 px-4 hover:bg-slate-500 cursor-pointer">Settings</li>
          <li 
            className="py-2 px-4 hover:bg-slate-500 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
