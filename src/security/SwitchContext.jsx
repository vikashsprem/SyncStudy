import { createContext, useContext, useState } from "react";

//1: Create a Context
export const SwitchMode = createContext();

export const useSwitchMode = () => useContext(SwitchMode);

//2: Share the created context with other components
export default function SwitchMode({ children }) {
  const [isStudy, setStudy] = useState(true);
  const [isShare, setShare] = useState(false);

  return (
    <SwitchMode.Provider value={{ isStudy, isShare, setShare, setStudy }}>
      {children}
    </SwitchMode.Provider>
  );
}
