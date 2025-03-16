import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceRequest = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [tableNo, setTableNo] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [customRequest, setCustomRequest] = useState<string>("");

  // Fetch requests from the backend
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

  // Function to submit a new request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNo || !service) {
      toast.warning("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/requests", {
        tableNo,
        service,
      });
      setRequests([...requests, res.data]);
      setTableNo("");
      setService("");
      toast.success("Request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request.");
    }
  };

  // Function to handle predefined service requests
  const requestService = async (serviceName: string) => {
    if (!tableNo) {
      toast.warning("Please enter your table number first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/requests", {
        tableNo,
        service: serviceName,
      });
      setRequests([...requests, res.data]);
      toast.success("Service request submitted successfully!");
    } catch (error) {
      console.error("Error submitting service request:", error);
      toast.error("Failed to submit service request.");
    }
  };

  // Function to handle extra custom requests
  const submitCustomRequest = async () => {
    if (!tableNo || !customRequest) {
      toast.warning("Please enter your table number and describe your request.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/requests", {
        tableNo,
        service: customRequest,
      });
      setRequests([...requests, res.data]);
      setCustomRequest(""); // Clear input field after submission
      toast.success("Custom request submitted successfully!");
    } catch (error) {
      console.error("Error submitting custom request:", error);
      toast.error("Failed to submit custom request.");
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

      <section className="bg-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <img src="/images/logoARoma.gif" alt="logo" className="w-12 h-12" />
          <div className="text-center">
            <h1 className="text-4xl font-bold">AROMA</h1>
            <p className="text-sm text-gray-600">A fine diner experience with us</p>
          </div>
          <div className="text-lg font-semibold">Welcome, User!</div>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center space-x-8 mb-6">
          {["Home", "Restaurant", "Menu", "Contact", "Feedback", "FAQ"].map((item) => (
            <a href={`${item.toLowerCase()}.html`} key={item} className="text-lg font-semibold">
              {item}
            </a>
          ))}
        </nav>

        {/* Hero Section */}
        <div className="relative">
          <img src="images/hero.png" alt="top" className="w-full h-100 object-cover" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold max-w-xl text-center">
            ENJOY THE<br />FINER THINGS IN LIFE
          </div>
        </div>

        {/* Service Request Section */}
        <div className="mt-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Enter Your Table Number</h2>
            <input
              type="number"
              placeholder="Table Number"
              className="w-1/2 p-2 text-center text-lg border border-gray-300 rounded-md"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              required
            />
          </div>

          <h2 className="text-center text-2xl font-semibold mt-10">Request a Service</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-6">
            {[
              { name: "Extra Napkins", imageUrl: "/images/napkins1.png", desc: "Request additional napkins." },
              { name: "Chef Special", imageUrl: "/images/chef.png", desc: "Ask the chef for their best recommendation today." },
              { name: "Water", imageUrl: "/images/water1.png", desc: "Request extra water." },
              { name: "Extra Cutlery", imageUrl: "/images/cutlery.png", desc: "Request additional cutlery." },
              { name: "Table Cleaning", imageUrl: "/images/table1.png", desc: "Request your table to be cleaned." },
              { name: "Drink Refill", imageUrl: "/images/refill.jpg", desc: "Request a refill for your drink." },
              { name: "Condiments", imageUrl: "/images/condiments.jpeg", desc: "Request extra condiments (ketchup, mustard, etc.)." },
              { name: "Assistance", imageUrl: "/images/assistance.png", desc: "Request a staff member for assistance." },
              { name: "Takeaway Boxes", imageUrl: "/images/takeaway.png", desc: "Request a container for leftovers." },
              { name: "Bill Request", imageUrl: "/images/bill.png", desc: "Request your bill to check out." },
              { name: "WiFi Password", imageUrl: "/images/wifi.png", desc: "Request access to the restaurant's Wi-Fi." },
            ].map((service, index) => (
              <div key={index} className="relative bg-white rounded-lg shadow-lg overflow-hidden h-[500px]">
                <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-between p-6 text-white text-center">
                  <div>
                    <h3 className="font-bold text-xl">{service.name}</h3>
                    <p className="text-sm text-gray-200">{service.desc}</p>
                  </div>
                  <button
                    className="py-2 px-4 bg-red-500 text-white rounded-md"
                    onClick={() => requestService(service.name)}
                  >
                    Request Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Request Section */}
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-semibold">Extra Requests</h2>
            <p className="text-sm text-gray-600 mb-4">Submit a custom request for any additional services.</p>
            <textarea
              placeholder="Type your request here..."
              className="w-1/2 p-3 text-lg border border-gray-400 rounded-md"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
            ></textarea>
            <div className="mt-4">
              <button className="py-2 px-4 bg-red-500 text-white rounded-md" onClick={submitCustomRequest}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceRequest;