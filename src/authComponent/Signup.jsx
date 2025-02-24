import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.css";
import { useNavigate } from "react-router-dom";

const OtpAuth = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/auth/login");
  };

  return (
    <div className="flex justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md p-3 m-2 rounded-md"
        id="form"
      >
        <div className="font-semibold p-2">
          <p
            className="text-3xl text-green-500"
            style={{ wordSpacing: "-0.2rem", fontFamily: "cursive" }}
          >
            An email has been sent to your account successfully.
          </p>
        </div>

        <div className="flex justify-center">
          <p className="border border-t-black opacity-20 w-full"></p>
        </div>

        <div>
          <p className="text-xl font-semibold">
            Please follow the given steps:
          </p>
          <ol className="opacity-50 pl-3">
            <li>1. Go to your email</li>
            <li>2. Check your inbox</li>
            <li>3. Open the email</li>
            <li>4. Click on verify</li>
            <li>5. Set your password</li>
          </ol>
        </div>

        <div className="flex justify-center">
          <p className="border border-t-black opacity-20 w-full"></p>
        </div>

        <div className="m-2 flex justify-center space-y-1">
          <button
            type="submit"
            className="text-black p-2 w-2/3 font-semibold text-sm rounded-sm"
            id="continue-button"
          >
            Go back to login
          </button>
        </div>
        <div className="flex justify-center cursor-pointer">
          <p className="text-center font-semibold border border-gray-500 hover:text-sm rounded-md p-1 w-fit text-xs">
            Resend email
          </p>
        </div>
      </form>
    </div>
  );
};

export default OtpAuth;
