import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../apiConfig/ApiClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  // Initialize state from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    
    if (storedToken) {
      setAuthenticated(true);
      setToken(storedToken);
      
      if (storedUserId) {
        setUserId(storedUserId);
      }
      
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  async function handleLogin(jwtToken, username, userId, roles) {
    console.log('Login with userId:', userId);
    setAuthenticated(true);
    setUsername(username);
    setToken(jwtToken);
    
    // Store in both session and local storage
    sessionStorage.setItem('token', jwtToken);
    localStorage.setItem('token', jwtToken);
    
    // Store user ID and username
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    
    setUserId(userId);
    setUserRoles(roles || []);
  }

  function handleLogout() {
    setAuthenticated(false);
    setToken(null);
    setUsername(null);
    setUserId(null);
    setUserRoles([]);
    
    // Clear both storages
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  const isAdmin = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_SUPERADMIN');
  const isSuperAdmin = userRoles.includes('ROLE_SUPERADMIN');

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        username,
        userId,
        userRoles,
        isAdmin,
        isSuperAdmin,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 