import { createContext, useContext, useState } from "react";
import { apiClient } from "../apiConfig/ApiClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  async function handleLogin(jwtToken, username, userId, roles) {
    setAuthenticated(true);
    setUsername(username);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    setUserId(userId);
    setUserRoles(roles || []);
  }

  function handleLogout() {
    setAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
    setUsername(null);
    setUserId(null);
    setUserRoles([]);
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