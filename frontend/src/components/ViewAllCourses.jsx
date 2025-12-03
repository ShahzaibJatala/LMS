import React, { useEffect, useState } from "react";
import { ArrowLeft, Search, Star } from "lucide-react";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";

// Dummy data
const categories = [
  "App Development",
  "AI/ML",
  "AI Tools",
  "Data Science",
  "Data Analytics",
  "Ethical Hacking",
  "UI/UX Designing",
  "Web Development",
  "Others",
];

const ViewAllCourses = () => {
  const [courses,setCourses] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
  
    const fetchCourses = async () => {
      try {
        const response = await axios.get(serverUrl + "/api/course/getAllCourses", { withCredentials: true });
        const data = response.data;
        console.log("Fetched courses:", data);
        
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }
  fetchCourses();
  },[])
  console.log("courses", courses);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(course.category))
  );

  return (
    <div className="w-full flex min-h-screen bg-gray-950 p-2 sm:p-6">
      {/* Sidebar */}
      <div className="w-40 sm:w-64 bg-slate-400 rounded-2xl shadow-md p-6 mr-6 h-fit">
        
          <button
            className="text-white hover:text-slate-300 transition mt-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={22} />
          </button>
        <h2 className="text-lg font-semibold mb-4">
             Filter by Category</h2>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search with AI..."
            className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="mr-2 accent-blue-600"
              />
              <span className="text-gray-700">{cat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Courses Grid */}
      <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 h-fit">
        {filteredCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default ViewAllCourses;
