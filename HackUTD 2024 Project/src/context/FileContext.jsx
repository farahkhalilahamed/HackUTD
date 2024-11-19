import React, { createContext, useState, useContext } from "react";

// Create context
const FileContext = createContext();

// Custom hook to use the FileContext
export const useFileContext = () => useContext(FileContext);

// Context provider component
export const FileProvider = ({ children }) => {
  const [parsedData, setParsedData] = useState([]);

  return (
    <FileContext.Provider value={{ parsedData, setParsedData }}>
      {children}
    </FileContext.Provider>
  );
};
