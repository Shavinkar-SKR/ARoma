import React from "react";

const Security = () => {
  return (
    <div className="bg-gray-100 p-6">
      {/* Security Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Security at ARoma</h2>

        <p className="mb-4 text-gray-700">
          At ARoma, we take security very seriously. We are committed to ensuring the privacy and safety of our users, and we actively work with security researchers to address potential vulnerabilities.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Responsible Disclosure</h3>
        <p className="text-gray-700 mb-4">
          If you are a security researcher or expert and have identified a potential security issue with ARoma’s website or applications, we request that you disclose it responsibly. Our team is dedicated to addressing any security concerns in a timely and responsible manner.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. How to Submit a Security Issue</h3>
        <p className="text-gray-700 mb-4">
          Please submit any security-related issues through our HackerOne page. Be sure to include a detailed description of the issue, as well as steps to reproduce it if possible. We appreciate your efforts to ensure the security of our platform and its users.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. What Happens After Submission</h3>
        <p className="text-gray-700 mb-4">
          Once you’ve submitted a bug or security issue, our security team will review it promptly. We may contact you for further clarification or additional details. We will work with you to resolve the issue as quickly as possible.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Acknowledging Security Researchers</h3>
        <p className="text-gray-700 mb-4">
          We recognize the contributions of security researchers who help us improve the security of our platform. 
        </p>

        <p className="text-center text-gray-600 mt-8">
          If you have any questions about this security policy, please contact our <a href="mailto:aromabizofficial@gmail.com" className="text-red-600 hover:text-red-800">support team</a>.
        </p>
        <p className="text-center text-gray-600 mt-8">
          <a href="mailto:aromabizofficial@gmail.com" className="text-red-600 hover:text-red-800">Click here </a> to submit security issues.
        </p>
      </div>
    </div>
  );
};

export default Security;
