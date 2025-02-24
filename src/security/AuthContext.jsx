import { createContext, useContext, useState } from "react";
import { apiClient } from "../apiConfig/ApiClient";
import { executeJwtAuthenticationService } from "../apiConfig/ApiService";

//1: Create a Context
export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

//2: Share the created context with other components
export default function AuthProvider({ children }) {

    //3: Put some state in the context
    const [isAuthenticated, setAuthenticated] = useState(true)

    const [username, setUsername] = useState(null)

    const [token, setToken] = useState(null)


    async function handleLogin(username, password) {

        try {

            const response = await executeJwtAuthenticationService(username, password)

            if (response.status == 200) {

                const jwtToken = 'Bearer ' + response.data.token

                setAuthenticated(true)
                setUsername(username)
                setToken(jwtToken)
                localStorage.setItem("token",jwtToken);

                apiClient.interceptors.request.use(
                    (config) => {
                        config.headers.Authorization = jwtToken || localStorage.getItem("token");
                        return config
                    }
                )

                return true
            } else {
                handleLogout()
                return false
            }
        } catch (error) {
            handleLogout()
            return false
        }
    }


    function handleLogout() {
        setAuthenticated(false)
        setToken(null)
        setUsername(null)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout, username, token }}>
            {children}
        </AuthContext.Provider>
    )
}