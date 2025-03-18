import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 p-6">
      {/* Privacy Policy Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Privacy Policy</h2>
        
        <p className="mb-4 text-gray-700">
          Welcome to AROMA. Your privacy is important to us. This privacy policy outlines the types of personal information we collect, how we use it, and the measures we take to protect it. By using our services, you consent to the practices described in this policy.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h3>
        <p className="text-gray-700 mb-4">
          We collect personal information such as your name, email address, and payment details when you register or make a purchase. We may also collect data related to your usage of our platform, including device and location data.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h3>
        <p className="text-gray-700 mb-4">
          The information we collect is used to personalize your experience, process transactions, and improve our services. We may also use your information to communicate with you about promotions, updates, and customer support.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h3>
        <p className="text-gray-700 mb-4">
          We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. We use encryption, firewalls, and secure servers to ensure your data is safe.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Sharing Your Information</h3>
        <p className="text-gray-700 mb-4">
          We do not sell, trade, or rent your personal information to third parties. However, we may share your data with trusted third-party service providers who assist us in operating our platform or providing services to you.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Cookies</h3>
        <p className="text-gray-700 mb-4">
          We use cookies to enhance your experience and provide personalized content. You can control cookie settings in your browser, but disabling cookies may affect some features of our website.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h3>
        <p className="text-gray-700 mb-4">
          You have the right to access, correct, and delete your personal information. If you wish to exercise these rights, please contact us through the contact details provided on our website.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">7. Changes to Privacy Policy</h3>
        <p className="text-gray-700 mb-4">
          We reserve the right to modify this privacy policy at any time. Any changes will be posted on this page with the updated date. We encourage you to review this policy periodically to stay informed about how we protect your privacy.
        </p>

        <p className="text-center text-gray-600 mt-8">
        If you have any questions about this privacy policy, please contact our <a href="mailto:aromabizofficial@gmail.com" className="text-red-600 hover:text-red-800"> support team</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
