import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import Logo from "../../../components/svgs/Logo";
import logo from "../../../assets/logo.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {

  const queryClient = useQueryClient(); // React Query client to manage cache
  
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Mutation function for handling login request
  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/api/auth/login", formData, {
        withCredentials: true, // Ensures cookies are sent with request
      });
      if (!res.data.success) throw new Error(res.data.message || "Login failed");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["authProfile"] }); // Refresh user auth state
     
    },
    onError: () => toast.error("Invalid Credentials"),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="h-screen bg-black-900 text-white flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center p-6 gap-10">
        {/* Logo Section */}
        <div className="hidden md:flex w-1/2 justify-center">
          <Logo className="w-48 fill-white hover:fill-primary transition-colors duration-300" />
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 bg-black-900 p-8">
          <div className="space-y-6">
            <img src={logo} alt="Logo" className="md:hidden mx-auto w-1/2" />
            <h2 className="text-4xl font-bold text-primary text-center">Login Account</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Fields */}
              {[{ name: "email", type: "email", icon: <FiMail /> },
                { name: "password", type: "password", icon: <FiLock /> }].map((field, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 transition-all">
                    <span className="text-primary text-lg">{field.icon}</span>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none placeholder-gray-400 text-white"
                    />
                  </div>
                </div>
              ))}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-focus rounded-lg font-semibold text-white transition-all shadow-lg"
              >
                {isLoading ? "Please Wait..." : "Login"}
              </button>
            </form>

            {/* Signup Link */}
            <p className="text-center text-gray-400">
              Don't have an account? 
              <Link to="/signup" className="text-primary hover:text-primary-focus underline transition-colors">
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
