import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiUser, FiLock } from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import Logo from "../../../components/svgs/Logo.jsx";
import logo from "../../../assets/logo.png";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });

  const [errors, setErrors] = useState({}); // State to hold field-specific errors

  // Function to call the signup API
  const mutateForm = async (formData) => {
    const res = await axios.post("/api/auth/signup", formData, {
      withCredentials: true, // Add this line
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "An error occurred");
    }
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: mutateForm,
    onSuccess: () => {
      toast.success("Account Created Successfully");
      setErrors({}); // Clear errors on success
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        // Handle backend validation errors
        if (error.response?.data?.errors) {
          const validationErrors = error.response.data.errors.reduce(
            (acc, err) => {
              acc[err.field] = err.message;
              return acc;
            },
            {}
          );
          setErrors(validationErrors); // Set field-specific errors
        } else {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the field being edited
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation for empty fields
    // const requiredFields = ["email", "username", "fullname", "password"];
    const requiredFields = Object.keys(formData)
    const newErrors = {};
    let hasError = false;

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field} is required`;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    mutate(formData, {
      onSuccess: () => {
        setFormData({ email: "", username: "", fullname: "", password: "" });
      }
    });
  
  };

  return (
    <div className="h-screen bg-black-900 text-white flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col max-h-screen md:flex-row items-center justify-center md:justify-between md:gap-12 p-6">
        {/* Big Logo: Visible on medium (md) and larger screens.  */}

        <div className="hidden md:flex w-1/2 justify-center md:justify-start">
          <Logo className="w-[20vw] h-auto md:w-48 fill-white hover:fill-primary transition-colors duration-300" />
        </div>

        <div className="w-full md:w-1/2 bg-black-900 p-8">
          <div className="space-y-6">
            {/*
              Small Logo: Visible on screens smaller than medium (md).
            */}
            <img
              src={logo}
              alt="Not Found"
              width={300}
              className="md:hidden mx-auto w-1/2 h-auto" //  md:hidden only for small screens
            />
            <h2 className="text-4xl font-bold text-primary text-center md:text-left">
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { name: "email", type: "email", icon: <FiMail /> },
                { name: "username", type: "text", icon: <FiUser /> },
                { name: "fullname", type: "text", icon: <BsPerson /> },
                { name: "password", type: "password", icon: <FiLock /> },
              ].map((field, index) => (
                <div key={index} className="group relative">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 group-focus-within:border-primary transition-all duration-300">
                    <span className="text-primary text-lg">{field.icon}</span>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={
                        field.name.charAt(0).toUpperCase() + field.name.slice(1)
                      }
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full bg-transparent grow outline-none placeholder-gray-400 text-white"
                      required
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-3 px-6 bg-primary hover:bg-primary-focus rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                disabled={isPending}
              >
                {isPending ? "Please Wait..." : "Sign Up"}
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
