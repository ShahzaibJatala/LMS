import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../Redux/CourseSlice";

const CreateCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const course = useSelector((state) => state.course.courseData);
  // console.log(course);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
  });
// console.log(formData);

  const categories = [
    "Web Development",
    "UI/UX Design",
    "App Development",
    "Ethical Hacking",
    "AI/ML",
    "Data Science",
    "Data Analytics",
    "AI Tools",
    "Others",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Course Data:", formData);
    // You can send this data to your backend
    try {
      const result = await axios.post( serverUrl + "/api/course/create", formData, { withCredentials: true });
      console.log(result.data);
      dispatch(setCourseData([result.data]));
      toast.success("Course created successfully");
      navigate("/courses");
      
    } catch (error) {
      console.log("Error creating course:", error);      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <button
          className="relative top-9 text-grey-600 hover:text-black transition"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Course
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Course Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter course title"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:outline-none"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-1 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-xl hover:bg-slate-700 transition"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
