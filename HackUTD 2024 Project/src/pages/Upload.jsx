import React, { useState } from "react";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import { useFileContext } from "../context/FileContext"; // Import the context

const Upload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setParsedData } = useFileContext(); // Use the context to update parsed data

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please upload a valid Excel or CSV file.");
    }
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (result) => resolve(result.data),
        error: (error) => reject(error),
      });
    });
  };

  const parseExcel = async (file) => {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];
    const data = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        data.push({
          modelYear: row.getCell(1).value,
          mfrName: row.getCell(2).value,
          cityFE: row.getCell(10).value,
          hwyFE: row.getCell(11).value,
        });
      }
    });

    return data;
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    try {
      let data = [];

      if (file.type === "text/csv") {
        data = await parseCSV(file);
      } else {
        data = await parseExcel(file);
      }

      setParsedData(data); // Update context with parsed data
      setError(null);
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container bg-gray-50 min-h-screen">
      <header className="bg-darkblue text-white text-center py-8 shadow-lg">
        <h1 className="text-4xl font-bold">File Upload Portal</h1>
        <p className="text-lg mt-2">Upload your Excel or CSV files quickly and easily.</p>
      </header>

      <div className="container mx-auto py-10">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-darkblue mb-4">Upload Your File</h2>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="border border-gray-300 rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <button
            onClick={handleUpload}
            className={`w-full py-2 px-4 text-white rounded transition ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
