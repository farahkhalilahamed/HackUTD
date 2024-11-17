import React, { createContext, useState, useContext } from 'react';

// Create a context for the file and fake data
const FileContext = createContext();

// Custom hook to use the file context
export const useFile = () => {
  return useContext(FileContext);
};

// File provider component
export const FileProvider = ({ children }) => {
  const [file, setFile] = useState(null);  // Store the actual file or null
  const [fakeData, setFakeData] = useState(null);  // Store fake data if upload fails

  // Function to set actual file
  const uploadFile = (file) => {
    setFile(file);
  };

  // Function to set fake data
  const setFake = (data) => {
    setFakeData(data);
  };

  return (
    <FileContext.Provider value={{ file, fakeData, uploadFile, setFakeData: setFake }}>
      {children}
    </FileContext.Provider>
  );
};
