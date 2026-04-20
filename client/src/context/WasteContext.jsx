import { createContext, useContext, useState } from "react";

const WasteContext = createContext(null);

export function WasteProvider({ children }) {
  const [selectedWaste, setSelectedWaste] = useState(null);   // e.g. "plastic"
  const [actionData, setActionData] = useState(null);         // fetched from /api/action/:type
  const [path, setPath] = useState("A");                      // "A" = handle, "B" = offer

  return (
    <WasteContext.Provider value={{ selectedWaste, setSelectedWaste, actionData, setActionData, path, setPath }}>
      {children}
    </WasteContext.Provider>
  );
}

export function useWaste() {
  return useContext(WasteContext);
}
