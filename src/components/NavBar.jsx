import React, { useEffect, useState } from "react";
import logo from "../assets/booklogo.png";
import Profile from "./AccountSection";
import { Link } from "react-router-dom";
import "./component.css";
import { useAuth } from "../security/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import GridViewIcon from "@mui/icons-material/GridView";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MessageIcon from "@mui/icons-material/Message";
import StoreIcon from "@mui/icons-material/Store";
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import NotificationDropdown from "./NotificationDropdown";

function NavBar() {
  const { isAuthenticated } = useAuth();
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const [mode, setMode] = useState(localStorage.getItem("mode") || "study");
  const [showNotifications, setShowNotifications] = useState(false);

  // Log unread count changes
  useEffect(() => {
    console.log('NavBar - Current unread count:', unreadCount);
  }, [unreadCount]);

  // Initial fetch when navbar mounts
  useEffect(() => {
    if (isAuthenticated) {
      console.log('NavBar - Initial fetch of notification count');
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchUnreadCount]);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "study" ? "share" : "study"));
  };

  const toggleNotifications = () => {
    console.log('NavBar - Toggling notification dropdown');
    setShowNotifications(prev => !prev);
  };

  const handleCloseNotifications = () => {
    console.log('NavBar - Closing notification dropdown');
    setShowNotifications(false);
    // Refresh notification count after closing
    fetchUnreadCount();
  };

  return (
    <nav className='bg-white border-gray-200 dark:bg-gray-900 shadow-sm shadow-slate-500 p-2'>
      <div className='flex flex-col sm:flex-row justify-between'>
        <div className='flex justify-between px-5 items-center flex-1'>
          <Link
            className='flex items-center space-x-3 rtl:space-x-reverse cursor-pointer'
            to={mode === "study" ? "/books" : "/home"}
            onClick={toggleMode}
          >
            {mode === "study" ? (
              <>
                <img src={logo} className='h-10' alt='book Logo' />
                <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white hover:text-purple-600'>
                  SyncStudy
                </span>
              </>
            ) : (
              <>
                <GridViewIcon className='text-gray-500' />
                <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white hover:text-purple-600'>
                  ShareMate
                </span>
              </>
            )}
          </Link>
          <div className='items-center gap-3 md:gap-5 text-xxs flex sm:hidden'>
            {isAuthenticated && <Profile />}
          </div>
        </div>

        <div className='border-b-[0.1px] border-white w-full my-2 sm:hidden'></div>

        <div className='flex items-center space-x-5 md:order-2 justify-center p-2'>
          {isAuthenticated && (
            <div className='flex items-center gap-2 md:gap-4 text-sm font-medium'>
              <Link
                to='/cabshare'
                className='flex items-center gap-2 px-3 py-2 rounded-full border border-gray-600 bg-gray-900 text-white hover:border-purple-500 hover:text-purple-300 transition'
              >
                <DirectionsCarIcon className='text-base' />
                <span className='hidden sm:inline'>Cab Share</span>
              </Link>
              <Link
                to='/project-collaboration'
                className='flex items-center gap-2 px-3 py-2 rounded-full border border-gray-600 bg-gray-900 text-white hover:border-purple-500 hover:text-purple-300 transition'
              >
                <WorkspacesIcon className='text-base' />
                <span className='hidden sm:inline'>Collaboration</span>
              </Link>

              <Link
                to='/chat'
                className='flex items-center gap-2 px-3 py-2 rounded-full border border-gray-600 bg-gray-900 text-white hover:border-purple-500 hover:text-purple-300 transition'
              >
                <MessageIcon className='text-base' />
                <span className='hidden sm:inline'>Discussion</span>
              </Link>

              <Link
                to='/market-place'
                className='flex items-center gap-2 px-3 py-2 rounded-full border border-gray-600 bg-gray-900 text-white hover:border-purple-500 hover:text-purple-300 transition'
              >
                <StoreIcon className='text-base' />
                <span className='hidden sm:inline'>Marketplace</span>
              </Link>

              {/* Notification Icon */}
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className='flex items-center gap-2 px-3 py-2 rounded-full border border-gray-600 bg-gray-900 text-white hover:border-purple-500 hover:text-purple-300 transition'
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon className='text-base' />
                  </Badge>
                  <span className='hidden sm:inline'>Notifications</span>
                </button>
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={handleCloseNotifications} 
                />
              </div>
            </div>
          )}
          <div className='items-center gap-3 md:gap-5 text-sm font-medium hidden sm:flex'>
            {isAuthenticated && <Profile />}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
