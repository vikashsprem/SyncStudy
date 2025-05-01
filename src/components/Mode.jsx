import * as React from "react";
import { useNavigate } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import { useAuth } from "../security/AuthContext";

export default function ColorToggleButton({ mode , setMode }) {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = () => {
    const newMode = mode === "share" ? "study" : "share";
    setMode(newMode);
    localStorage.setItem("mode", newMode);

    if (newMode === "study") {
      navigate("/books");
    } else {
      navigate("/home");
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="flex mx-5 gap-2">
        <Button color="primary" sx={{border:'1px solid #30373e', px:3}} onClick={() => navigate("/auth/login")}>
          Log In
        </Button>
        <Button color="primary" sx={{border:'1px solid #30373e', px:3}} onClick={() => navigate("/register")}>
          Sign up
        </Button>
      </div>
    );
  }

  return (
    <ToggleButtonGroup
      color="secondary"
      value={mode}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="study" color="primary" sx={{ color: "white" }}>
        SyncStudy
      </ToggleButton>
      <ToggleButton value="share" sx={{ color: "white" }}>
        ShareMate
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
