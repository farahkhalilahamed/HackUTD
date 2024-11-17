import React, { useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { FileContext } from "../context/FileContext";

const Dashboard = () => {
  const { fileData } = useContext(FileContext); // Access the uploaded file info
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    if (fileData && fileData.filePath) {
      fetchAnalytics(fileData.filePath);
      fetchInsights(fileData.filePath);
      fetchNotifications(fileData.filePath);
    }
  }, [fileData]);

  const fetchAnalytics = async (filePath) => {
    try {
      const result = await axiosClient.get(`/dashboard/analytics?file_path=${filePath}`);
      setAnalytics(result.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchInsights = async (filePath) => {
    try {
      const result = await axiosClient.get(`/dashboard/insights?file_path=${filePath}`);
      setInsights(result.data.data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  const fetchNotifications = async (filePath) => {
    try {
      const result = await axiosClient.get(`/dashboard/notifications?file_path=${filePath}`);
      setNotifications(result.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {fileData ? (
        <>
          <p>Analyzing file: {fileData.fileName}</p>
          {analytics && <pre>{JSON.stringify(analytics, null, 2)}</pre>}
          {insights && <pre>{JSON.stringify(insights, null, 2)}</pre>}
          {notifications && <pre>{JSON.stringify(notifications, null, 2)}</pre>}
        </>
      ) : (
        <p>No file uploaded. Please upload a file first.</p>
      )}
    </div>
  );
};

export default Dashboard;
