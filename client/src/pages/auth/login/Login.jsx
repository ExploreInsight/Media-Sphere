import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import Logo from "../../../components/svgs/Logo";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Form Submitted:", formData);
  };

  return (
    <div className="h-screen bg-black-900 text-white flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center p-6 md:justify-between gap-10 md:gap-12">
        {/* Logo Section - Matches SignUp layout */}
        <div className="hidden md:flex w-1/2 justify-center md:justify-start">
          <Logo className="w-[20vw] h-auto md:w-48 fill-white hover:fill-primary transition-colors duration-300" />
        </div>

        {/* Form Section - Updated with SignUp styling */}
        <div className="w-full md:w-1/2 bg-black-900 p-8">
          <div className="space-y-6">
            <img
              src="../../../../assets/logo.png"
              alt="Not Found"
             
              width={300}
              className="lg:hidden mx-auto h-auto "
            />
            <h2 className="text-4xl font-bold text-primary text-center md:text-left">
              Login to Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { name: "email", type: "email", icon: <FiMail /> },
                { name: "password", type: "password", icon: <FiLock /> },
              ].map((field, index) => (
                <div key={index} className="group relative">
                  <div className="flex items-center gap-3 md:p-3 p-2 rounded-lg bg-gray-800 border border-gray-700 group-focus-within:border-primary transition-all duration-300">
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
                className="w-full md:py-3 py-2 px-6 bg-primary hover:bg-primary-focus rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Login
              </button>
            </form>

            <p className="text-center md:text-left text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary-focus underline transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
