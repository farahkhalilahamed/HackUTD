import React, { useState, useEffect } from "react";
import Plotly from "react-plotly.js";
import { useFileContext } from "../context/FileContext";

const Dashboard = () => {
  const { parsedData } = useFileContext();
  const [graphData1, setGraphData1] = useState([]);
  const [graphData2, setGraphData2] = useState([]);
  const [graphData3, setGraphData3] = useState([]);
  const [brandComparisonData, setBrandComparisonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    mfrName: "All",
    modelYear: "All",
    cityFE: { min: null, max: null },
    hwyFE: { min: null, max: null },
  });

  useEffect(() => {
    if (parsedData.length > 0) {
      prepareGraphData(parsedData);
      setFilteredData(parsedData);
    }
  }, [parsedData]);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const prepareGraphData = (data) => {
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

    const graphData3 = data.map((row) => ({
      modelYear: row.modelYear,
      cityFE: row.cityFE,
      hwyFE: row.hwyFE,
    }));

    setGraphData3(graphData3);

    const brandComparison = Object.keys(mfrData).map((mfr) => ({
      mfr,
      averageCityFE: mfrData[mfr].totalCityFE / mfrData[mfr].count,
      averageHwyFE: mfrData[mfr].totalHwyFE / mfrData[mfr].count,
    }));

    setBrandComparisonData(brandComparison);
  };

  const applyFilters = () => {
    let filtered = parsedData;

    Object.keys(filters).forEach((key) => {
      if (key === "cityFE" || key === "hwyFE") {
        if (filters[key].min !== null) {
          filtered = filtered.filter((item) => item[key] >= filters[key].min);
        }
        if (filters[key].max !== null) {
          filtered = filtered.filter((item) => item[key] <= filters[key].max);
        }
      } else if (filters[key] !== "All") {
        filtered = filtered.filter((item) => {
          if (key === "modelYear" && filters[key] === "2024") {
            return true;
          }
          return item[key] === filters[key];
        });
      }
    });

    setFilteredData(filtered);
  };

  const getUniqueValues = (key) => {
    return ["All", ...new Set(parsedData.map((item) => item[key]))];
  };

  const handleFilterChange = (key, value, type = "select") => {
    if (type === "range") {
      setFilters((prev) => ({
        ...prev,
        [key]: { ...prev[key], ...value },
      }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const renderFilterIcon = (key) => (
    <select
      value={filters[key]}
      onChange={(e) => handleFilterChange(key, e.target.value)}
      className="border border-gray-300 rounded p-1 ml-2 text-sm"
    >
      {getUniqueValues(key).map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  const renderRangeFilter = (key) => (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        placeholder="Min"
        value={filters[key].min || ""}
        onChange={(e) =>
          handleFilterChange(key, { min: e.target.value ? parseFloat(e.target.value) : null }, "range")
        }
        className="border border-gray-300 rounded p-1 text-sm w-20"
      />
      <input
        type="number"
        placeholder="Max"
        value={filters[key].max || ""}
        onChange={(e) =>
          handleFilterChange(key, { max: e.target.value ? parseFloat(e.target.value) : null }, "range")
        }
        className="border border-gray-300 rounded p-1 text-sm w-20"
      />
    </div>
  );

  return (
    <div className="upload-container bg-gray-50 min-h-screen">
      <header className="bg-darkblue text-white text-center py-8 shadow-lg">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-lg mt-2">
          Explore insights from your data and filter as you feel.
        </p>
      </header>

      {parsedData.length === 0 ? (
        <p className="text-center text-lg text-gray-600 mt-8">
          No data available, upload a file first.
        </p>
      ) : (
        <>
          <div className="graph-section mb-8">
            <div className="text-center text-darkblue py-4 mb-4">
              <h2 className="text-2xl font-semibold">Graph Analysis</h2>
            </div>

            {/* Centering the graphs */}
            <div className="flex justify-center space-x-4">
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
                  xaxis: { title: "Model Year" },
                  yaxis: { title: "Average City FE" },
                }}
                style={{ width: "90%", height: "400px" }} // Adjusted width
              />
            </div>

            <div className="flex justify-center space-x-4">
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
                style={{ width: "90%", height: "400px" }} // Adjusted width
              />
            </div>

            <div className="flex justify-center space-x-4">
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
                style={{ width: "90%", height: "400px" }} // Adjusted width
              />
            </div>

            <div className="flex justify-center space-x-4">
              <Plotly
                data={[
                  {
                    type: "bar",
                    x: brandComparisonData.map((item) => item.mfr),
                    y: brandComparisonData.map((item) => item.averageCityFE),
                    name: "Average City FE",
                    marker: { color: "#4f82e2" },
                  },
                  {
                    type: "bar",
                    x: brandComparisonData.map((item) => item.mfr),
                    y: brandComparisonData.map((item) => item.averageHwyFE),
                    name: "Average Highway FE",
                    marker: { color: "#ff7f0e" },
                  },
                ]}
                layout={{
                  title: "Fuel Efficiency Comparison by Manufacturer",
                  barmode: "group",
                  xaxis: { title: "Manufacturer" },
                  yaxis: { title: "Fuel Efficiency (FE)" },
                }}
                style={{ width: "90%", height: "400px" }} // Adjusted width
              />
            </div>
          </div>

          <div className="data-table">
            <div className="text-center text-darkblue py-4 mb-4">
              <h2 className="text-2xl font-semibold">Uploaded Data</h2>
            </div>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">
                    Model Year {renderFilterIcon("modelYear")}
                  </th>
                  <th className="border px-4 py-2">
                    Mfr Name {renderFilterIcon("mfrName")}
                  </th>
                  <th className="border px-4 py-2">
                    City FE {renderRangeFilter("cityFE")}
                  </th>
                  <th className="border px-4 py-2">
                    Hwy FE {renderRangeFilter("hwyFE")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
