import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/empty.jpg";
import axios from "axios";
import { serverUrl } from "../../App";


const Courses = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  // console.log(user);
  const [courses, setCourses] = useState([]);
  

  useEffect(() => {

    const getCourses = async () => {
      const res = await axios.get( serverUrl + "/api/course/getCreatorCourses", { withCredentials: true });
      const results = res.data;
      // console.log(results[0]);
      
      setCourses(results);
      
    }
     
    getCourses();



    },[])


      console.log("courses array:", courses);
    



  return (
    <div className="min-h-screen bg-gray-600 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            className="text-white hover:text-slate-300 transition"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
        </div>
        <button
          className="bg-black text-white px-6 py-2 rounded-xl shadow hover:bg-slate-300 hover:text-black transition"
          onClick={() => navigate("/createcourse")}
        >
          Create Course
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-300 rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-300 text-gray-700 text-sm">
            <tr>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course,idx) => (              
              <tr
                key={course._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={course?.thumnil}
                    alt={course?.title}
                    className="w-16 h-12 rounded-lg object-cover border"
                  />
                  <span className="font-medium text-gray-800">
                  {course?.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">$ {course ? course?.price : "N/A"}</td>
                <td className="px-6 py-4">
                  <span className="bg-yellow-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
                  {course?.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4" onClick={() => navigate(`/editcourse/${course?._id}`)}>
                  <button className="text-gray-600 hover:text-black">
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="space-y-4 md:hidden">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white p-4 rounded-xl shadow flex items-start gap-4"
          >
            <img
              src={course?.thumnil || logo}
              alt={course?.title}
              className="w-20 h-14 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800">{course?.title}</h2>
              <p className="text-gray-600 text-sm">${course?.price}</p>
              <span className="mt-1 inline-block bg-yellow-100 text-slate-700 px-2 py-0.5 rounded-md text-xs">
                {course?.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <button className="text-gray-600 hover:text-black" onClick={() => navigate(`/editcourse/${course?._id}`)}>
              <Edit size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
