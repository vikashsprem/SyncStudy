// UserDropdown.js

import React from "react";
import { useState } from "react";
import { useAuth } from "../security/AuthContext";
import Avatar from "@mui/material/Avatar";
import ProfileImage from "../assets/dummy-profile.png";

const Profile = () => {
  const { username } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <Avatar alt="Profile" src={ProfileImage} className="cursor-pointer" />
    </>
  );
};

export default Profile;
