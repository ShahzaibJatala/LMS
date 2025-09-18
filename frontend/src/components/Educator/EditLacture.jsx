import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";

const EditLecture = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const[loading,setLoading] = useState(false);
  const {courseId} = useParams();
  const {lactureId} = useParams();
  const navigate = useNavigate();

 const handleFileChange = (e) => {
   const file = e.target.files[0];
   
   if (file) {
     // check file type
     if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file.");
      e.target.value = ""; // reset input
      return;
    }
    
    // check file size (50MB = 50 * 1024 * 1024 bytes)
    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB.");
      e.target.value = ""; // reset input
      return;
    }

    setFile(file);

  }
};


  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  const formData = new FormData();
  formData.append("lactureTitle", title);
  formData.append("isPriviewFree", isFree);
  formData.append("videoUrl", file); // Ensure this matches the field name in multer

  try {
    const res = await axios.post(
      `${serverUrl}/api/course/getCourseLactures/${lactureId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    console.log("Lecture updated:", res.data);
    toast.success("Lecture updated successfully");
    setLoading(false);
  } catch (error) {
    console.error("Upload lecture error:", error);
    toast.error("Failed to update lecture");
    setLoading(false);
  }
};


  const handleRemoveLacture = async () => {
    try {
      const res = await axios.delete(serverUrl + "/api/course/removecourse/" + lactureId, { withCredentials: true });
      console.log("Lacture removed:", res.data);
      navigate("/createlacture/" + courseId);
      
    } catch (error) {
      toast.error("Failed to remove lacture");
    }
   
  }



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-600">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-300 shadow-lg rounded-2xl w-full max-w-lg p-6"
      >
        {/* Header */}
        <button
          className="relative top-9 text-grey-600 hover:text-black transition"
          onClick={() => navigate("/createlacture/" + courseId)}
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center justify-between mb-6 ml-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Update Your Lecture
          </h2>
          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={() => handleRemoveLacture()} >
            Remove Lecture
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="Enter lecture title"
          />
        </div>

        {/* Video Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Video <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="videoUrl"
            accept="video/*"
            onChange={(e) => handleFileChange(e)}
            className="block w-full text-sm text-gray-600 
                       file:mr-4 file:py-2 file:px-4 
                       file:rounded-lg file:border-0 
                       file:text-sm file:font-semibold 
                       file:bg-gray-700 file:text-white
                       hover:file:bg-black"
          />
        </div>

        {/* Free Checkbox */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            checked={isFree}
            onChange={() => setIsFree(!isFree)}
            className="h-4 w-4 text-black rounded border-gray-300 focus:ring-black"
          />
          <label className="text-gray-700 text-sm font-medium">
            Is this video FREE
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition"
        >{loading ? "Updating..." : "Update Lecture"}
          
        </button>
      </form>
    </div>
  );
};

export default EditLecture;
