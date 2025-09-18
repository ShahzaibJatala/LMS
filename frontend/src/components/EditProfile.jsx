import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUserData } from "../Redux/userSlice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);

  const [username, setUsername] = useState(user?.user?.name || "");
  const [description, setDescription] = useState(user?.user?.description || "");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // 🖼️ Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 🧹 Clean up blob URL when component unmounts
//   useEffect(() => {
//     return () => {
//       if (preview) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

  // 📌 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("description", description);
      if (file) {
        formData.append("photoURL", file); // send actual file
      }

      const result = await axios.post(
        `${serverUrl}/api/user/updateProfile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(setUserData(result.data.user));
      toast.success("Profile updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Edit profile error:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 p-4">
      <div className="bg-zinc-400 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        {/* Back Button */}
        <button
          className="absolute top-4 left-4 text-gray-600 hover:text-black transition"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft size={24} />
        </button>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Edit Profile
        </h2>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 rounded-full border-4 border-blue-900 shadow-md overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={user?.user?.photoURL || "https://via.placeholder.com/100"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-gray-600 border border-gray-300 rounded-lg p-2 cursor-pointer"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.user?.email || ""}
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
