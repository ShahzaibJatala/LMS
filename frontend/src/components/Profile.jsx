import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { setUserData } from "../Redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";

const Profile = () => {
  const userData = useSelector((state) => state.user.userData);  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const handleLogout = async () => {
    try {
      
      const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      await signOut(auth);
      dispatch(setUserData(null));
      toast.warning("logout successfully");

    } catch (error) {
      // console.log(error);
      toast.error("could not logout");

    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 p-6">
      <div className="bg-gray-950 shadow-2xl rounded-2xl p-8 w-full max-w-md relative text-white">

        {/* Back Button */}
        <button
          className="absolute top-4 left-4 text-gray-300 hover:text-blue-400 transition"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={26} />
        </button>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">

          {userData.user?.photoURL ? (
            <img
              src={userData.user.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-blue-500 shadow-lg bg-gray-800 text-white text-3xl font-semibold">
              {userData.user?.name?.slice(0, 1).toUpperCase() || "U"}
            </div>
          )}



          <h2 className="mt-4 text-2xl font-semibold">{userData?.user?.name}</h2>
          <p className="text-gray-400 text-sm">{userData?.user?.role}</p>
        </div>

        {/* User Details */}
        <div className="mt-6 space-y-3 text-gray-300">
          <p>
            <span className="font-semibold text-white">Email:</span> {userData?.user?.email}
          </p>
          <p>
            <span className="font-semibold text-white">Bio:</span> {userData?.user?.description}
          </p>
          <p>
            <span className="font-semibold text-white">Enrolled Courses:</span> {userData?.user?.enrolledCourses.length}
          </p>
        </div>

        {/* Edit Button */}
        <div className="mt-6 flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-md transition cursor-pointer" onClick={() => navigate("/editprofile")}>
            Edit Profile
          </button>
        </div>

        {/* Edit Button */}
        <div className="mt-6 flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-md transition cursor-pointer" onClick={() => handleLogout()}>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
