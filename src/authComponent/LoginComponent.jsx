import React, { useState } from "react";
import "./auth.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../security/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { executeJwtAuthenticationService } from "../apiConfig/ApiService";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasLoginFailed, setHasLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await executeJwtAuthenticationService(username, password);
      if (response.status === 200) {
        const { token, userId } = response.data;
        await auth.handleLogin(token, username, userId);
        setLoading(false);
        const mode = localStorage.getItem("mode");
        if(mode === "study") navigate("/books");
        else navigate("/home");
      } else {
        setHasLoginFailed(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setHasLoginFailed(true);
      setLoading(false);
    }
  }

  // create a message component to display the error message if login fails for 3 seconds
  const handleInvalidCredentials = () => {
    if (hasLoginFailed) {
      setTimeout(() => {
        setHasLoginFailed(false);
      }, 3000);
      return (
        <p id="invalid" style={{ fontSize: "0.63em", padding: "2px" }}>
          Invalid username or password
        </p>
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto h-screen mt-10">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 m-2 p-3 rounded-md h-full"
        id="form"
      >
        <div className="text-center">
          <p id="account-paragraph">Log in to SyncStudy</p>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute bg-red-600 px-3">
            {handleInvalidCredentials()}
          </div>
        </div>

        <div className="m-2 flex justify-center">
          <input
            placeholder="Enter your email"
            type="email"
            className="input-box  px-3 py-2 w-4/5  rounded-sm"
            name="email"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="m-2 flex justify-center space-y-1">
          <input
            placeholder="Enter your password"
            type="password"
            className="input-box  px-3 w-4/5 py-2  rounded-sm"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="m-2 flex justify-center">
          <button
            type="submit"
            className=" text-black p-2 w-4/5 font-semibold text-sm rounded-sm"
            id="continue-button"
          >
            {loading ? (
              <div className="flex justify-center align-middle gap-3">
                <CircularProgress size={20} color="white" />{" "}
                <span>Logging you in</span>
              </div>
            ) : (
              "Continue"
            )}
          </button>
        </div>

        <div className="flex justify-center">
          <Link
            to="/users/create"
            className="text-white text-xs font-semibold underline"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="flex justify-center">
          <p className="border border-t-black opacity-10 w-3/4"></p>
        </div>

        <div>
          <div className="m-3 flex justify-center">
            <span
              href=""
              className="border-gray-400 border font-bold  text-gray-400 p-2 w-4/5 text-center rounded-3xl text-sm"
            >
              Continue with Google
            </span>
          </div>
          <div className="m-2 flex justify-center">
            <span
              href=""
              className="border-gray-400 border font-bold  text-gray-400 p-2 w-4/5 text-center rounded-3xl text-sm"
            >
              Continue with Facebook
            </span>
          </div>
          <div className="m-2 flex justify-center">
            <span
              href=""
              className="border-gray-400 border font-bold  text-gray-400 p-2 w-4/5 text-center rounded-3xl text-sm"
            >
              Continue with phone number
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <p className="border border-t-black opacity-10 w-3/4"></p>
        </div>

        <div className="flex justify-center">
          <p
            style={{ fontSize: "0.73em" }}
            className="font-semibold opacity-60"
          >
            Note: If you haven't registered yet.
            <Link to="/users/create" className="text-white underline">
              {" "}
              Register now
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;
