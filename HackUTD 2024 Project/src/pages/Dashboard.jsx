import React, { useState, useEffect } from "react";
import Plotly from "react-plotly.js";
import { useFileContext } from "../context/FileContext";

const Dashboard = () => {
  const { parsedData } = useFileContext();
  const [graphData1, setGraphData1] = useState([]);
  const [graphData2, setGraphData2] = useState([]);
  const [graphData3, setGraphData3] = useState([]);

  useEffect(() => {
    if (parsedData.length > 0) {
      prepareGraphData(parsedData);
    }
  }, [parsedData]);

  const prepareGraphData = (data) => {
    // Graph 1: Average City FE by Model Year
    const modelYearData = data.reduce((acc, curr) => {
      const year = curr.modelYear;
      if (!acc[year]) {
        acc[year] = { count: 0, totalCityFE: 0 };
      }
      acc[year].count += 1;
      acc[year].totalCityFE += curr.cityFE;

      return acc;
    }, {});

    const graphData1 = Object.keys(modelYearData).map((year) => ({
      year,
      averageCityFE: modelYearData[year].totalCityFE / modelYearData[year].count,
    }));

    setGraphData1(graphData1);

    // Graph 2: Average City FE vs Highway FE per Manufacturer
    const mfrData = data.reduce((acc, curr) => {
      const mfr = curr.mfrName;
      if (!acc[mfr]) {
        acc[mfr] = { count: 0, totalCityFE: 0, totalHwyFE: 0 };
      }
      acc[mfr].count += 1;
      acc[mfr].totalCityFE += curr.cityFE;
      acc[mfr].totalHwyFE += curr.hwyFE;

      return acc;
    }, {});

    const graphData2 = Object.keys(mfrData).map((mfr) => ({
      mfr,
      averageCityFE: mfrData[mfr].totalCityFE / mfrData[mfr].count,
      averageHwyFE: mfrData[mfr].totalHwyFE / mfrData[mfr].count,
    }));

    setGraphData2(graphData2);

    // Graph 3: Comparison of City FE and Highway FE per Model Year
    const graphData3 = data.map((row) => ({
      modelYear: row.modelYear,
      cityFE: row.cityFE,
      hwyFE: row.hwyFE,
    }));

    setGraphData3(graphData3);
  };

  return (
    <div className="dashboard-container bg-gray-50 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Dashboard</h1>

      {/* Graph Section */}
      <div className="graph-section mb-8">
        <h2 className="text-2xl font-semibold mb-4">Graph Analysis</h2>

        {/* Graph 1: Average City Fuel Efficiency by Model Year */}
        <Plotly
          data={[
            {
              type: "bar",
              x: graphData1.map((item) => item.year),
              y: graphData1.map((item) => item.averageCityFE),
              marker: { color: "#4f82e2" },
            },
          ]}
          layout={{
            title: "Average City Fuel Efficiency by Model Year",
            xaxis: { title: "Model Year", tickangle: -45 },
            yaxis: { title: "Average City FE" },
          }}
          style={{ width: "100%", height: "400px" }}
        />

        {/* Graph 2: City vs Highway Fuel Efficiency per Manufacturer */}
        <Plotly
          data={[
            {
              type: "scatter",
              mode: "markers",
              x: graphData2.map((item) => item.averageCityFE),
              y: graphData2.map((item) => item.averageHwyFE),
              text: graphData2.map((item) => item.mfr),
              marker: { size: 12, color: "#f47560" },
            },
          ]}
          layout={{
            title: "City vs Highway Fuel Efficiency per Manufacturer",
            xaxis: { title: "Average City FE" },
            yaxis: { title: "Average Highway FE" },
          }}
          style={{ width: "100%", height: "400px" }}
        />

        {/* Graph 3: Comparison of City FE and Highway FE per Model Year */}
        <Plotly
          data={[
            {
              type: "box",
              x: graphData3.map((item) => item.modelYear),
              y: graphData3.map((item) => item.cityFE),
              name: "City FE",
              marker: { color: "#1f77b4" },
            },
            {
              type: "box",
              x: graphData3.map((item) => item.modelYear),
              y: graphData3.map((item) => item.hwyFE),
              name: "Highway FE",
              marker: { color: "#ff7f0e" },
            },
          ]}
          layout={{
            title: "Fuel Efficiency Comparison by Model Year",
            xaxis: { title: "Model Year" },
            yaxis: { title: "Fuel Efficiency (FE)" },
          }}
          style={{ width: "100%", height: "400px" }}
        />
      </div>

      {/* Uploaded Data Table */}
      <div className="data-table">
        <h2 className="text-2xl font-semibold mb-4">Uploaded Data</h2>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Model Year</th>
              <th className="border px-4 py-2">Mfr Name</th>
              <th className="border px-4 py-2">City FE</th>
              <th className="border px-4 py-2">Hwy FE</th>
            </tr>
          </thead>
          <tbody>
            {parsedData.map((row, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{row.modelYear}</td>
                <td className="border px-4 py-2">{row.mfrName}</td>
                <td className="border px-4 py-2">{row.cityFE}</td>
                <td className="border px-4 py-2">{row.hwyFE}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
