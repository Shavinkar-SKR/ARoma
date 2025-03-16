import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="bg-gray-100 p-6">
      {/* Contact Us Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Contact Us</h2>

        <p className="mb-4 text-gray-700">
          We would love to hear from you! If you have any questions, feedback, or need support, please feel free to reach out to us using the form below.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold p-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Send Message
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8">
          If you prefer, you can also <a href="mailto:aromabizofficial@gmail.com" className="text-red-600 hover:text-red-800">email us directly</a>.
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
