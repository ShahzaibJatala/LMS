import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { serverUrl } from "../../App";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CreateLecture = () => {
  const [lactureTitle, setlactureTitle] = useState("");
  const [lactures, setLactures] = useState([]);
  const {courseId} = useParams();
  const navigate = useNavigate();

  const handleAddLecture = async () => {
  try {
    const res = await axios.post(
      `${serverUrl}/api/course/createlacture/${courseId}`,
      { lactureTitle },   // matches backend naming
      { withCredentials: true }
    );
    setLactures([res.data.lacture]);
    setlactureTitle("");
  } catch (error) {
    console.log("handleAddLecture err", error.response?.data || error.message, error);
  }
};

useEffect(() => {
  const fetchCourseData = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/course/getCourseLactures/${courseId}`, { withCredentials: true });
      const courseData = res.data.lactures;
      setLactures(courseData);
      console.log("Fetched course data:", courseData);
      
      
    } catch (error) {
      console.log("fetchCourseData err", error.response?.data || error.message, error);
      
    }
  }
fetchCourseData();
},[courseId]);

// console.log(lactureTitle);

  return (
    <div className="bg-gray-600 min-h-screen flex items-center justify-center p-6">
    <div className="max-w-2xl mx-auto bg-slate-300 rounded-2xl shadow p-6 space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800">
        Let’s Add a Lecture
      </h2>
      <p className="text-gray-500 text-sm">
        Enter the title and add your video lectures to enhance your course content.
      </p>

      {/* Input */}
      <input
        type="text"
        placeholder="e.g. Introduction to Mern Stack"
        value={lactureTitle}
        onChange={(e) => setlactureTitle(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required="true"
      />

      {/* Buttons */}
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100" onClick={() => navigate("/allcourses") }>
          ← Back to Course
        </button>
        <button
          onClick={handleAddLecture}
          className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          + Create Lecture
        </button>
      </div>

      {/* Lecture List */}
      <div className="space-y-3">
        {lactures?.map((lecture,idx) => (
          <div
            key={lecture?._id}
            className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 shadow-sm"
          >
            <span className="text-gray-800 font-medium">
              lacture {idx+1} : {lecture?.lactureTitle}
            </span>
            <button className="text-gray-500 hover:text-indigo-600" onClick={() => navigate(`/editlacture/${courseId}/${lecture?._id}`)}>
              <Pencil size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default CreateLecture;
