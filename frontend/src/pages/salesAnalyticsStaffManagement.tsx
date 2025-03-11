import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

const SalesAnalyticsStaffManagement = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState({ name: "", role: "" });

  // Fetch sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/sales");
        setSalesData(res.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, []);

  // Fetch staff members
  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/staff");
        setStaffMembers(res.data);
      } catch (error) {
        console.error("Error fetching staff members:", error);
      }
    };
    fetchStaffMembers();
  }, []);

  // Add a new staff member
  const addStaffMember = async () => {
    if (!newStaff.name || !newStaff.role) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/staff", newStaff);
      setStaffMembers([...staffMembers, res.data]);
      setNewStaff({ name: "", role: "" });
    } catch (error) {
      console.error("Error adding staff member:", error);
    }
  };

  // Delete a staff member
  const deleteStaffMember = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/staff/${id}`);
      setStaffMembers(staffMembers.filter(staff => staff._id !== id));
    } catch (error) {
      console.error("Error deleting staff member:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Analytics & Staff Management</h1>

      {/* Sales Analytics Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart for Daily Sales */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Daily Sales</h3>
            <BarChart width={500} height={300} data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </div>

          {/* Line Chart for Monthly Sales Trend */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Monthly Sales Trend</h3>
            <LineChart width={500} height={300} data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
            </LineChart>
          </div>
        </div>
      </div>

      {/* Staff Management Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Staff Management</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {/* Add Staff Form */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Add New Staff Member</h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Role"
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                className="p-2 border rounded"
              />
              <button
                onClick={addStaffMember}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Staff
              </button>
            </div>
          </div>

          {/* Staff List */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Staff Members</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff) => (
                  <tr key={staff._id} className="border">
                    <td className="p-2 border">{staff.name}</td>
                    <td className="p-2 border">{staff.role}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => deleteStaffMember(staff._id)}
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
    </div>
  );
};

export default SalesAnalyticsStaffManagement;