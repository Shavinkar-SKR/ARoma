import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch staff and sales data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const staffRes = await axios.get("http://localhost:5001/api/staff");
        setStaff(staffRes.data);

        const salesRes = await axios.get("http://localhost:5001/api/sales");
        setSales(salesRes.data.sales);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add new staff
  const handleAddStaff = async () => {
    if (
      !newStaff.staffId ||
      !newStaff.name ||
      !newStaff.role ||
      newStaff.salary <= 0
    ) {
      setError("Please fill all fields correctly.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/staff", newStaff);
      setError("");
      toast.success("Staff added successfully!");
      setNewStaff({ staffId: "", name: "", role: "", salary: 0 });
      const res = await axios.get("http://localhost:5001/api/staff");
      setStaff(res.data);
    } catch (error) {
      setError("Error adding staff. Please try again.");
      console.error("Error adding staff:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search staff by ID
  const handleSearchStaff = async () => {
    if (!searchId) {
      setError("Please enter a Staff ID.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5001/api/staff/${searchId}`
      );
      setSearchedStaff(res.data);
      setError("");
    } catch (error) {
      setError("Staff not found. Please check the Staff ID.");
      console.error("Error searching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update staff role and salary
  const handleUpdateStaff = async (
    id: string,
    role: string,
    salary: number
  ) => {
    if (!role || salary <= 0) {
      setError("Please fill all fields correctly.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`http://localhost:5001/api/staff/${id}`, {
        role,
        salary,
      });
      setError("");
      toast.success("Staff updated successfully!");
      const res = await axios.get("http://localhost:5001/api/staff");
      setStaff(res.data);
    } catch (error) {
      setError("Error updating staff. Please try again.");
      console.error("Error updating staff:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete staff
  const handleDeleteStaff = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5001/api/staff/${id}`);
        setError("");
        toast.success("Staff deleted successfully!");
        const res = await axios.get("http://localhost:5001/api/staff");
        setStaff(res.data);
      } catch (error) {
        setError("Error deleting staff. Please try again.");
        console.error("Error deleting staff:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Sales analytics summary
  const totalOrders = sales.length;
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const averageSale = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Salary Distribution Histogram Data
  const salaryData = staff.map((s) => ({ salary: s.salary }));
  const salaryBins = [0, 30000, 60000, 90000, 120000, 150000]; // Define salary bins/ranges

  const histogramData = salaryBins.map((bin, index) => {
    const rangeStart = bin;
    const rangeEnd = salaryBins[index + 1] || Infinity;
    const count = salaryData.filter(
      (s) => s.salary >= rangeStart && s.salary < rangeEnd
    ).length;
    return {
      range: `${rangeStart} - ${rangeEnd === Infinity ? "∞" : rangeEnd}`,
      count,
    };
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 className="text-2xl font-bold mb-4 text-red-600">
        Sales Analytics & Staff Management
      </h1>

      {/* Sales Analytics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Sales Analytics
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-red-600">{totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalSales.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Average Sale</p>
            <p className="text-2xl font-bold text-red-600">
              ${averageSale.toFixed(2)}
            </p>
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
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Staff Management
        </h2>

        {/* Add Staff Form */}
        <div className="mb-4 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Add New Staff
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Staff ID"
              value={newStaff.staffId}
              onChange={(e) =>
                setNewStaff({ ...newStaff, staffId: e.target.value })
              }
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, name: e.target.value })
              }
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Role"
              value={newStaff.role}
              onChange={(e) =>
                setNewStaff({ ...newStaff, role: e.target.value })
              }
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="number"
              placeholder="Salary"
              value={newStaff.salary}
              onChange={(e) =>
                setNewStaff({ ...newStaff, salary: parseFloat(e.target.value) })
              }
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={handleAddStaff}
            className="mt-4 bg-red-600 text-white p-2 rounded hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
          >
            Add Staff
          </button>
        </div>

        {/* Search Staff */}
        <div className="mb-4 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Search Staff by ID
          </h3>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter Staff ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="p-2 border rounded mr-2 flex-grow focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleSearchStaff}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
            >
              Search
            </button>
          </div>
          {searchedStaff && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p>
                <strong>Name:</strong> {searchedStaff.name}
              </p>
              <p>
                <strong>Role:</strong> {searchedStaff.role}
              </p>
              <p>
                <strong>Salary:</strong> ${searchedStaff.salary}
              </p>
            </div>
          )}
        </div>

        {/* Salary Distribution Histogram */}
        <div className="mb-4 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Salary Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Staff List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Staff List
          </h3>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-600 text-white">
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
                            st._id === s._id
                              ? { ...st, role: e.target.value }
                              : st
                          );
                          setStaff(updatedStaff);
                        }}
                        className="p-1 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={s.salary}
                        onChange={(e) => {
                          const updatedStaff = staff.map((st) =>
                            st._id === s._id
                              ? { ...st, salary: parseFloat(e.target.value) }
                              : st
                          );
                          setStaff(updatedStaff);
                        }}
                        className="p-1 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() =>
                          handleUpdateStaff(s._id, s.role, s.salary)
                        }
                        className="bg-yellow-500 text-white p-1 rounded mr-2 hover:bg-yellow-600 active:bg-yellow-700 transition-colors duration-200"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(s._id)}
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 active:bg-red-700 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsAndStaffManagement;
