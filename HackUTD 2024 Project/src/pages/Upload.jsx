import React, { useState } from "react";
import axiosClient from "../api/axiosClient";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await axiosClient.post("/upload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(result.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <div>
      <h2 className="text-darkblue text-2xl poppins-bold mx-auto flex w-screen max-w-screen-lg flex-col items-center py-10">
        Upload File
      </h2>
      <div className="text-darkblue text-xl poppins-bold mx-auto flex w-screen max-w-screen-lg flex-col items-center py-10">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default Upload;
