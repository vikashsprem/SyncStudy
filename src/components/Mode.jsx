import * as React from "react";
import { useNavigate } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import { useAuth } from "../security/AuthContext";

export default function ColorToggleButton() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [mode, setLocalMode] = React.useState(localStorage.getItem("mode") || "study");

  const handleChange = () => {
    const newMode = mode === "share" ? "study" : "share";
    setLocalMode(newMode);
    localStorage.setItem("mode", newMode);

    if (newMode === "study") {
      navigate("/books");
    } else {
      navigate("/home");
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <Button variant="contained" color="primary" onClick={() => navigate("/auth/login")}>
        Login
      </Button>
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
