import React, { useState } from "react";
import logo from "../assets/booklogo.png";
import Profile from "./AccountSection";
import Mode from "./Mode";
import { Link } from "react-router-dom";
import "./component.css";
import { useAuth } from "../security/AuthContext";
import GridViewIcon from "@mui/icons-material/GridView";

function NavBar() {
  const { isAuthenticated } = useAuth();
  const mode = localStorage.getItem("mode");

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-sm shadow-slate-500 p-2">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex justify-between px-5 items-center flex-1">
            {mode==="study" ? (
              <Link
                href="#"
                className="flex items-center space-x-3 rtl:space-x-reverse"
                to="/books"
              >
                <img src={logo} className="h-10" alt="book Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  SyncStudy
                </span>
              </Link>
            ) : (
              <Link
                href="#"
                className="flex items-center space-x-3 rtl:space-x-reverse"
                to="/home"
              >
                <GridViewIcon className="text-gray-500" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  ShareMate
                </span>
              </Link>
            )}
            {isAuthenticated && <Profile />}
          </div>

          <div className="border-b-[0.1px] border-white w-full my-2 sm:hidden"></div>

          <div className="flex items-center space-x-5  md:order-2 justify-center">
            <Mode />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
