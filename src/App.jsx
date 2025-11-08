import React from "react"
import EmployeeGrid from "./components/EmployeeGrid";

function App() {
  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", padding: "20px" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#1e3a8a" }}>Employee Performance Dashboard</h1>
        <p style={{ color: "#374151" }}>View, filter, and analyze company employee data</p>
      </header>
      <EmployeeGrid />
    </div>
  );
}

export default App;
