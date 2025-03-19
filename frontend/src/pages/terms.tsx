import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 p-6">
      
      
      {/* Terms and Conditions Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Terms and Conditions</h2>
        
        <p className="mb-4 text-gray-700">
          Welcome to AROMA. By accessing our website and services, you agree to comply with the following terms and conditions. Please read them carefully before proceeding.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. General Use</h3>
        <p className="text-gray-700 mb-4">
          Our platform provides a seamless dining experience, including online ordering and service requests. Misuse of these services may result in restrictions or bans.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. Service Requests</h3>
        <p className="text-gray-700 mb-4">
          Customers must provide accurate table numbers when making service requests. False or fraudulent requests may lead to service denial.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Payment & Billing</h3>
        <p className="text-gray-700 mb-4">
          All transactions must be completed as per the restaurant’s billing policies. Any disputes should be addressed with management immediately.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Privacy Policy</h3>
        <p className="text-gray-700 mb-4">
          Your personal data is protected in compliance with applicable privacy laws. We do not share your information with third parties without your consent.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Limitation of Liability</h3>
        <p className="text-gray-700 mb-4">
          AROMA is not responsible for any losses, damages, or disruptions caused by system errors, service delays, or unauthorized access.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h3>
        <p className="text-gray-700 mb-4">
          We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of the revised terms.
        </p>

        <p className="text-center text-gray-600 mt-8">
          If you have any questions about these terms, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
