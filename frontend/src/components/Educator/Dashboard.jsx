import React from "react";
import { ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { serverUrl } from "../../App";
import axios from "axios";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  // console.log(user);
  const [data, setData] = useState([]);
  // console.log("data",data);
  
 
  useEffect(() => {

    const fetchCreatorCourse = async () => {
      try {
        if (user?.user?.role !== "teacher") {
          navigate("/");
        }
        const response = await axios.get(serverUrl + "/api/course/getCreatorCourses", {withCredentials:true} );
        console.log(response.data);
        
         const transformed = response.data.map((course) => ({
          name: course.title,
          category: course.category,
          lecturesCount: course.lactures?.length || 0,
          students: course.enrollStudent?.length || 0,
        }));

        setData(transformed);
        // console.log("Creator Courses:", transformed?.category);
      } catch (error) {
        console.error("Error fetching creator courses:", error);
      }
  };

  fetchCreatorCourse();

  },[user,navigate])




  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Top Card */}
      <div className="bg-zinc-400 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-6">
          {/* Back Button */}
          <button className="text-gray-600 hover:text-black transition" onClick={() => navigate("/")}>
            <ArrowLeft size={22} />
          </button>

          {/* Profile Image */}
          <img
            src={user?.user?.photoURL || user?.user?.name?.[0]?.toUpperCase()}
            alt="Profile"
            className="hidden max-[440px]:hidden w-20 h-20 rounded-full border-4 border-gray-200 object-cover shadow-sm sm:block"
          />


          {/* User Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Welcome, <span className="text-black">{user?.user?.name}</span>
            </h2>
            <p className="text-gray-600 font-medium">
              Total Earning : <span className="font-semibold text-black">${user?.user?.price || 0}</span>
            </p>
            <p className="text-gray-800 text-sm">{user?.user?.description}</p>
          </div>

          {/* Button */}
          <div className="ml-auto">
            <button className="bg-black text-white px-6 py-2 rounded-xl shadow hover:bg-gray-800 transition" onClick={() => navigate("/courses")}>
              Courses
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Progress */}
        <div className="bg-zinc-200 rounded-2xl shadow-lg p-6">
          <h3 className="text-gray-800 font-semibold mb-4">
            Course Progress (Lectures)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lecturesCount" fill="#000000" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Enrollment */}
        <div className="bg-zinc-200 rounded-2xl shadow-lg p-6">
          <h3 className="text-gray-800 font-semibold mb-4">
            Student Enrollment
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#000000" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
