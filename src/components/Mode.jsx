import * as React from "react";
import { useNavigate } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ColorToggleButton({ setMode }) {
  const [alignment, setAlignment] = React.useState("study");
  const navigate = useNavigate();

  const handleChange = (event, newAlignment) => {
    if (newAlignment) {
      setAlignment(newAlignment);

      // Navigate based on the selected value
      if (newAlignment === "study") {
        navigate("/books");
        setMode(false);
      } else if (newAlignment === "share") {
        navigate("/home");
        setMode(true);
      }
    }
  };

  return (
    <ToggleButtonGroup
      color="secondary"
      value={alignment}
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
