// src/components/EmployeeGrid.jsx
import React, { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import employeesData from "../data/employees.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ✅ Register AG Grid Community Modules (Required for v34+)
ModuleRegistry.registerModules([AllCommunityModule]);  



const EmployeeGrid = () => {
  const gridRef = useRef();
  const [api, setApi] = useState(null); 
  const [rowData] = useState(employeesData);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  // ✅ 1️⃣ Filtered data (must come before chartData)
  const filteredData =
    departmentFilter === "All"
      ? rowData
      : rowData.filter((emp) => emp.department === departmentFilter);

  const departments = ["All", ...new Set(rowData.map((e) => e.department))];

  // ✅ 2️⃣ Chart data (depends on filteredData)
  const chartData = Object.entries(
    filteredData.reduce((acc, emp) => {
      acc[emp.department] = acc[emp.department] || [];
      acc[emp.department].push(emp.salary);
      return acc;
    }, {})
  ).map(([department, salaries]) => ({
    department,
    avgSalary: Math.round(
      salaries.reduce((a, b) => a + b, 0) / salaries.length
    ),
  }));

  // ✅ 3️⃣ AG Grid columns
  const columnDefs = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80, sortable: true },
      {
        headerName: "Name",
        valueGetter: (p) => `${p.data.firstName} ${p.data.lastName}`,
        sortable: true,
        filter: true,
      },
      { headerName: "Email", field: "email", flex: 1 },
      {
        headerName: "Department",
        field: "department",
        sortable: true,
        filter: true,
      },
      { headerName: "Position", field: "position", flex: 1 },
      {
        headerName: "Salary ($)",
        field: "salary",
        sortable: true,
        filter: "agNumberColumnFilter",
        valueFormatter: (p) => p.value.toLocaleString(),
      },
      { headerName: "Hire Date", field: "hireDate", filter: "agDateColumnFilter" },
      { headerName: "Age", field: "age", width: 90, sortable: true },
      { headerName: "Location", field: "location", sortable: true },
      {
        headerName: "Performance",
        field: "performanceRating",
        width: 120,
        cellStyle: (params) => ({
          color:
            params.value >= 4.5
              ? "green"
              : params.value < 3.5
              ? "red"
              : "black",
          fontWeight: "bold",
        }),
      },
      { headerName: "Projects", field: "projectsCompleted", width: 110 },
      {
        headerName: "Active",
        field: "isActive",
        cellRenderer: (p) => (p.value ? "✅" : "❌"),
        width: 100,
      },
      { headerName: "Manager", field: "manager", flex: 1 },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    }),
    []
  );

  // ✅ 4️⃣ Render section
  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      {/* Filter + Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search employees..."
            onChange={(e) => {
            if (api) {
              api.setGridOption("quickFilterText", e.target.value);  // ✅ correct API call
            }
          }}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
      </div>

      {/* 🌙 Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          background: darkMode ? "#facc15" : "#1e3a8a",
          color: darkMode ? "#111827" : "#fff",
          padding: "8px 14px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "15px",
          position: "absolute",
          top: "100px",
          right: "30px",
        }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

    

      {/* 🧾 AG Grid */}
      <div
        className={`ag-theme-alpine${darkMode ? "-dark" : ""}`}
        style={{ height: "80vh", width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={false}
          animateRows={true}
          theme="legacy"
          onGridReady={(params) => {setApi(params.api);}}
        />
      </div>
        
          {/* 📊 Summary Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {[
          { title: "Total Employees", value: filteredData.length },
          {
            title: "Average Salary",
            value:
              "$" +
              Math.round(
                filteredData.reduce((a, b) => a + b.salary, 0) /
                  filteredData.length
              ).toLocaleString(),
          },
          {
            title: "Avg Performance",
            value:
              (
                filteredData.reduce((a, b) => a + b.performanceRating, 0) /
                filteredData.length
              ).toFixed(2) + " ⭐",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "15px 25px",
              margin: "10px",
              minWidth: "180px",
              textAlign: "center",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h4 style={{ color: "#1e3a8a", marginBottom: "5px" }}>{card.title}</h4>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#111827" }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* 📈 Bar Chart */}
      <div style={{ marginTop: "30px", height: "300px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px", color: "#1e3a8a" }}>
          Average Salary by Department
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgSalary" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeGrid;
