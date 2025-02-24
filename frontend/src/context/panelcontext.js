import { createContext, useState } from "react";

export const PanelContext = createContext();

export const PanelProvider = ({ children }) => {
  const [panelToken, setPanelToken] = useState(localStorage.getItem("panelToken") || "");

  const updateToken = (newToken) => {
    setPanelToken(newToken);
    localStorage.setItem("panelToken", newToken);
  };

  return (
    <PanelContext.Provider value={{ panelToken, updateToken }}>
      {children}
    </PanelContext.Provider>
  );
};
