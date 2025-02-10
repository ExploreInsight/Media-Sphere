import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiUser, FiLock } from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import Logo from "../../../components/svgs/Logo.jsx";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="h-screen bg-black-900 text-white flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col max-h-screen md:flex-row items-center justify-center md:justify-between md:gap-12 p-6">
        {/* Logo Section - Centered on smaller screens, left-aligned on larger screens */}
        <div className="hidden md:flex w-1/2 justify-center md:justify-start">
          <Logo className="w-[20vw] h-auto md:w-48 fill-white hover:fill-primary transition-colors duration-300" />
        </div>

        {/* Form Section - Centered on smaller screens, right-aligned on larger screens */}
        <div className="w-full md:w-1/2 bg-black-900 p-8">
          <div className="space-y-6">
            <img
              src="../../../../assets/logo.png"
              alt="Not Found"
              width={300}
              className="lg:hidden mx-auto h-auto "
            />
            <h2 className="text-4xl font-bold text-primary text-center md:text-left">
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { name: "email", type: "email", icon: <FiMail /> },
                { name: "username", type: "text", icon: <FiUser /> },
                { name: "fullName", type: "text", icon: <BsPerson /> },
                { name: "password", type: "password", icon: <FiLock /> },
              ].map((field, index) => (
                <div key={index} className="group relative">
                  <div className="flex items-center gap-3 p-3  rounded-lg bg-gray-800 border border-gray-700 group-focus-within:border-primary transition-all duration-300">
                    <span className="text-primary text-lg">{field.icon}</span>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full bg-transparent grow outline-none placeholder-gray-400 text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-3 px-6 bg-primary hover:bg-primary-focus rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Sign Up
              </button>
            </form>

            <p className="text-center md:text-left text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-focus underline transition-colors duration-300"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
