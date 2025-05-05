import React, { useState } from "react";
import { useAuth } from "../security/AuthContext";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import ProfileImage from "../assets/dummy-profile.png";

const Profile = () => {
  const { handleLogout, isSuperAdmin, username } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log("isSuperAdmin", isSuperAdmin);
  const navigate = useNavigate();

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
          <li className="py-2 px-4 hover:bg-slate-500 cursor-pointer">{username?.split('@')[0]?.slice(0, 14) || "Profile"}</li>
          <li className="py-2 px-4 hover:bg-slate-500 cursor-pointer">Settings</li>
          {isSuperAdmin && (
            <li 
              className="py-2 px-4 hover:bg-slate-500 cursor-pointer"
              onClick={() => navigate('/admin/organizations')}
            >
              Manage Organizations
            </li>
          )}
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
