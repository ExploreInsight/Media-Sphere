import React from "react";
import { Link } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import logo from "../../assets/logo.png";
import axios from "axios";

import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SideBar = () => {
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post("/api/auth/logout", {
          withCredentials: true, // Add this line
        });
        if (!res.data) {
          throw new Error("Logout failed. Please try again.");
        }
      } catch (error) {
        throw new Error(error.response?.data?.error || "Logout request failed");
      }
    },

    onSuccess: () => {
      queryClient.setQueryData(["authProfile"], null);

      // Invalidate the query
      queryClient.invalidateQueries({ queryKey: ["authProfile"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const { data: authUser } = useQuery({ queryKey: ["authProfile"] });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center ">
          <img
            src={logo}
            width={100}
            alt="Not Found"
            className="h-auto rounded-full hover:bg-stone-900"
          />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition rounded-xl py-2 px-4 max-w-fit"
            >
              <MdHomeFilled className="w-8 h-8 " />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition rounded-xl py-2 px-4 max-w-fit"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.user.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition rounded-xl py-2 px-4 max-w-fit"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.user.username}`}
            className="mt-auto mb-10 flex gap-2 items-center transition hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={authUser?.user.profileImg || "/avatar-placeholder.png"}
                />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.user.fullname}
                </p>
                <p className="text-slate-500 text-sm">
                  @{authUser?.user.username}
                </p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer "
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SideBar;
