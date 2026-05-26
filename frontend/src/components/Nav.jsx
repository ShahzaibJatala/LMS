import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../Redux/userSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import logo from "../assets/logo.jpg"

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData); // from Redux

  
  const role = user?.user?.role; // "student" or "teacher"
  

   const handleLogout = async () => {
    try {
      
      const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      await signOut(auth);
      localStorage.removeItem("token");
      dispatch(setUserData(null));
      toast.success("logout successfully");

    } catch (error) {
      // console.log(error);
      toast.error("could not logout");

    }
  };

  // Update the main nav className and its child containers
return (
  <nav className="flex justify-between items-center px-4 md:px-6 py-3 bg-black text-white shadow">
    {/* Left logo - Remove extra spacing */}
    <Link to="/" className="flex items-center">
      <img src={logo} alt="Logo" className="h-8 w-8 md:w-9" />
    </Link>

    {/* Right side - Improve responsive layout */}
    <div className="flex items-center gap-2 md:gap-4">
      {/* Profile Section */}
      {user && (
        <div className="relative group">
          {user?.user?.photoURL ? 
            <img 
              src={user.user.photoURL} 
              alt="PP" 
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black font-semibold cursor-pointer" 
            /> : 
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black font-semibold cursor-pointer">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          }
          
          {/* Dropdown - Adjust position for mobile */}
          <div className="absolute right-0 md:left-1/2 md:-translate-x-1/2 mt-3 w-48 bg-white border border-grey-200 rounded-xl shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div
              onClick={() => navigate('/profile')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              My Profile
            </div>
            <div
              onClick={() => navigate('/courses')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              My Courses
            </div>
          </div>
        </div>
      )}

      {/* Dashboard button - Adjust padding for mobile */}
      {user && role === "teacher" && (
        <Link
          to="/dashboard"
          className="px-2 md:px-3 py-1 rounded-lg bg-white text-black hover:opacity-90 transition text-sm md:text-base"
        >
          Dashboard
        </Link>
      )}

      {/* Logout/Login button - Adjust for mobile */}
      {user ? (
        <button
          onClick={handleLogout}
          className="px-2 md:px-3 py-1 rounded-lg bg-black text-white hover:opacity-90 transition cursor-pointer text-sm md:text-base"
        >
          LogOut
        </button>
      ) : (
        <Link
          to="/login"
          className="px-2 md:px-3 py-1 rounded-lg bg-white text-black hover:opacity-90 transition text-sm md:text-base"
        >
          Login
        </Link>
      )}
    </div>
  </nav>
);
};

export default Nav;
