import React, { useState } from "react";
import "./auth.css";
import loginImage from "../assets/login.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../security/AuthContext";

const RegisterationComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState(false);
  // const [logout, setLogout] = useState(false);
  const [hasLoginFailed, setHasLoginFailed] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/users/signup");
  }

  // create a message component to display the error message if login fails for 3 seconds
  const handleInvalidCredentials = () => {
    if (hasLoginFailed) {
      setTimeout(() => {
        setHasLoginFailed(false);
      }, 3000);
      return (
        <p id="invalid" style={{ fontSize: "0.63em", color: "red" }}>
          Invalid username or password
        </p>
      );
    }
  };

  return (
    <div className="flex justify-center mt-5 h-screen">
      <form
        onSubmit={handleSubmit}
        className="space-y-5  w-1/3-md  p-1 rounded-md mt-5"
      >
        <div className="ml-6 flex justify-center">
          <p id="account-paragraph" className="w-4/5 p-1">
            Sign up to start Exploring
          </p>
        </div>

        <div className="m-2 flex justify-center">
          <input
            placeholder="name@domain.com"
            type="username"
            className="input-box p-1 w-2/3 px-3 py-2 border-gray-400 border rounded-sm"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="m-2 flex justify-center">
          <button
            type="submit"
            className="  text-black p-2 w-2/3 font-semibold text-sm rounded-sm"
            id="continue-button"
          >
            Next
          </button>
        </div>

        <div className="flex justify-center">
          <p className="border border-t-black opacity-20 w-3/5"></p>
        </div>

        <div>
          <div className="m-2 flex justify-center">
            <a
              href=""
              className="border-gray border font-bold  text-white p-2 w-2/3 text-center rounded-3xl text-sm"
            >
              Continue with Google
            </a>
          </div>
          <div className="m-2 flex justify-center">
            <a
              href=""
              className="border-gray border font-bold text-white p-2 w-2/3 text-center rounded-3xl text-sm"
            >
              Continue with Facebook
            </a>
          </div>
          <div className="m-2 flex justify-center">
            <a
              href=""
              className="border-gray border font-bold  text-white p-2 w-2/3 text-center rounded-3xl text-sm"
            >
              Continue with phone number
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <p className="border border-t-black opacity-20 w-3/5"></p>
        </div>

        <div className="flex justify-center">
          <p
            style={{ fontSize: "0.73em" }}
            className="font-semibold opacity-50"
          >
            Note: Already have an account?
            <Link to="/auth/login" className="text-white underline">
              {" "}
              Log in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterationComponent;
