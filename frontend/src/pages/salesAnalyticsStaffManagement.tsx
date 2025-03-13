import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const SalesAnalyticsAndStaffManagement = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState({
    staffId: "",
    name: "",
    role: "",
    salary: 0,
  });
  const [searchId, setSearchId] = useState("");
  const [searchedStaff, setSearchedStaff] = useState<any>(null);

  // Fetch staff and sales data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffRes = await axios.get("http://localhost:5001/api/staff");
        setStaff(staffRes.data);

        const salesRes = await axios.get("http://localhost:5001/api/sales");
        setSales(salesRes.data.sales);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Add new staff
  const handleAddStaff = async () => {
    try {
      await axios.post("http://localhost:5001/api/staff", newStaff);
      alert("Staff added successfully");
      setNewStaff({ staffId: "", name: "", role: "", salary: 0 });
      const res = await axios.get("http://localhost:5001/api/staff");
      setStaff(res.data);
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  // Search staff by ID
  const handleSearchStaff = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/staff/${searchId}`);
      setSearchedStaff(res.data);
    } catch (error) {
      console.error("Error searching staff:", error);
    }
  };

  // Update staff role and salary
  const handleUpdateStaff = async (id: string, role: string, salary: number) => {
    try {
      await axios.put(`http://localhost:5001/api/staff/${id}`, { role, salary });
      alert("Staff updated successfully");
      const res = await axios.get("http://localhost:5001/api/staff");
      setStaff(res.data);
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  // Delete staff
  const handleDeleteStaff = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/staff/${id}`);
      alert("Staff deleted successfully");
      const res = await axios.get("http://localhost:5001/api/staff");
      setStaff(res.data);
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  // Sales analytics summary
  const totalOrders = sales.length;
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const averageSale = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Analytics & Staff Management</h1>

      {/* Sales Analytics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Average Sale</p>
            <p className="text-2xl font-bold">${averageSale.toFixed(2)}</p>
          </div>
        </div>

        {/* Sales Chart */}
        <BarChart width={600} height={300} data={sales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Staff Management */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Staff Management</h2>
        {/* Add Staff Form */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Add New Staff</h3>
          <input
            type="text"
            placeholder="Staff ID"
            value={newStaff.staffId}
            onChange={(e) => setNewStaff({ ...newStaff, staffId: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <input
            type="text"
            placeholder="Name"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <input
            type="text"
            placeholder="Role"
            value={newStaff.role}
            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <input
            type="number"
            placeholder="Salary"
            value={newStaff.salary}
            onChange={(e) => setNewStaff({ ...newStaff, salary: parseFloat(e.target.value) })}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleAddStaff}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Staff
          </button>
        </div>

        {/* Search Staff */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Search Staff by ID</h3>
          <input
            type="text"
            placeholder="Enter Staff ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleSearchStaff}
            className="bg-green-500 text-white p-2 rounded"
          >
            Search
          </button>
          {searchedStaff && (
            <div className="mt-2">
              <p><strong>Name:</strong> {searchedStaff.name}</p>
              <p><strong>Role:</strong> {searchedStaff.role}</p>
              <p><strong>Salary:</strong> ${searchedStaff.salary}</p>
            </div>
          )}
        </div>

        {/* Staff List */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Staff List</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Staff ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Salary</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s._id} className="border">
                  <td className="p-2 border">{s.staffId}</td>
                  <td className="p-2 border">{s.name}</td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={s.role}
                      onChange={(e) => {
                        const updatedStaff = staff.map((st) =>
                          st._id === s._id ? { ...st, role: e.target.value } : st
                        );
                        setStaff(updatedStaff);
                      }}
                      className="p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={s.salary}
                      onChange={(e) => {
                        const updatedStaff = staff.map((st) =>
                          st._id === s._id ? { ...st, salary: parseFloat(e.target.value) } : st
                        );
                        setStaff(updatedStaff);
                      }}
                      className="p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleUpdateStaff(s._id, s.role, s.salary)}
                      className="bg-yellow-500 text-white p-1 rounded mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(s._id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsAndStaffManagement;

