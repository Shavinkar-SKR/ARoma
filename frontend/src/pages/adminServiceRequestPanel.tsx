import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminServiceRequestPanel = () => {
  const [requests, setRequests] = useState<any[]>([]);

  // Fetch all service requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/requests");
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to fetch requests.");
      }
    };
    fetchRequests();
  }, []);

  // Update request status
  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.put(`http://localhost:5001/api/requests/${id}`, { status });
      setRequests(requests.map(req => req._id === id ? { ...req, status } : req));
      toast.success("Request status updated successfully!");
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Failed to update request status.");
    }
  };

  // Delete a request
  const handleDeleteRequest = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/requests/${id}`);
      setRequests(requests.filter(req => req._id !== id));
      toast.success("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
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
        className="toast-container"
        toastClassName="bg-white text-gray-800 shadow-lg rounded-lg border border-gray-200 p-4 m-2 max-w-sm md:max-w-lg lg:max-w-xl"
        progressClassName="bg-green-500"
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      />

      {/* Top Bar */}
      <div className="bg-red-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-semibold tracking-wide">Admin Dashboard</h1>
        <img src="/images/logoARoma1.gif" alt="Logo" className="h-12" />
      </div>

      {/* Admin Dashboard Content */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Service Requests</h2>

        {/* Request Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full table-auto">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">Table No</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">Service</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">Status</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm text-gray-700 text-center">{req.tableNo}</td>
                  <td className="p-3 text-sm text-gray-700 text-center">{req.service}</td>
                  <td className="p-3 text-sm text-gray-700 text-center">{req.status}</td>
                  <td className="p-3 text-sm text-center">
                    <button
                      className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-red-100 hover:text-red-600 transition-colors mr-2"
                      onClick={() => handleStatusUpdate(req._id, "Completed")}
                    >
                      Mark as Completed
                    </button>
                    <button
                      className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-red-100 hover:text-red-600 transition-colors"
                      onClick={() => handleDeleteRequest(req._id)}
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

export default AdminServiceRequestPanel;