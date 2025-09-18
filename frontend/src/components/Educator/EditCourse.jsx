import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import logo from "../../assets/empty.jpg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../Redux/CourseSlice";

const EditCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPublished, setIsPublished] = useState(false);
  const { courseId } = useParams();
  // const [data,setData] = useState("");
  const [title,setTitle] = useState("");
  const [subtitle,setSubtitle] = useState("");
  const [description,setDescription] = useState("");
  const [level,setLevel] = useState("");
  const [price,setPrice]= useState("");
  const [thumnil,setThumnil] = useState(null);

useEffect(() => {
  const getCourseData = async () => {
    try {
      const res = await axios.post(`${serverUrl}/api/course/getCourseById/${courseId}`, 
        {}, {withCredentials:true}
      )
      const {title, subTitle, description, level, price, thumnil, isPublished} = res.data
      setTitle(title)
      console.log(res);
      
      
    } catch (error) {
      console.log("res err", error);
      
    }
    
  }
  getCourseData()

},[])


  

  

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setThumnil(file);
  }
};


  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("title", title);
  data.append("subtitle", subtitle);
  data.append("description", description);
  // data.append("category", category);
  data.append("level", level);
  data.append("price", price);
  data.append("isPublished", isPublished);
  if (thumnil) {
    data.append("thumnil", thumnil);
  }

  

  try {
    const res = await axios.post(
      `${serverUrl}/api/course/editCourse/${courseId}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    toast.success("Course updated successfully");
    dispatch(setCourseData([res.data]));
    console.log(res.data);
    toast.success("Course updated successfully");
  } catch (error) {
    console.error("Error updating course:", error);
  }
};


const removeCourseHandler = async () => {

  try {
    const res = await axios.post(
      `${serverUrl}/api/course/removeCourse/${courseId}`,{},
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    toast.success("Course removed successfully");
    console.log(res.data);
    navigate("/courses");
  } catch (error) {
    console.error("Error removing course:", error);
  }

}









  return (
    <div className="min-h-screen bg-gray-600 flex justify-center p-6">
      <div className="bg-slate-300 w-full max-w-3xl rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
        <button
                    className="text-black hover:text-slate-800 transition"
                    onClick={() => navigate("/courses")}
                    >
                    <ArrowLeft size={22} />
        </button>
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-800">
            Add detail information regarding course
          </h2>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800" onClick={() => navigate(`/createlacture/${courseId}`)}>
            Go to lectures page
          </button>
        </div>

        {/* Publish/Remove Buttons */}
        <div className="flex gap-4 mb-6 justify-between">

        
<label
  className="relative flex cursor-pointer items-center justify-center gap-[1em] ms-10"
  htmlFor="star" onClick={() => setIsPublished(!isPublished)}
>
  <input className="peer appearance-none" id="star" name="star" type="checkbox" />
  <span
    className="absolute left-0 top-1/2 h-[2em] w-[2em] -translate-x-full -translate-y-1/2 rounded-[0.25em] border-[1px] border-green-500"
  >
  </span>
  <svg
    className="absolute left-0 top-1/2 h-[2em] w-[2em] -translate-x-full -translate-y-1/2 duration-500 ease-out [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:[stroke-dashoffset:0]"
    viewBox="0 0 38 37"
    fill="none"
    height="37"
    width="38"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.617 36.785c-.676-5.093 4.49-10.776 6.318-14.952 1.887-4.31 4.315-10.701 6.055-15.506C20.343 2.59 20.456.693 20.57.789c3.262 2.744 1.697 10.518 2.106 14.675 1.926 19.575 4.62 12.875-7.635 4.43C12.194 17.933 2.911 12.1 1.351 8.82c-1.177-2.477 5.266 0 7.898 0 2.575 0 27.078-1.544 27.907-1.108.222.117-.312.422-.526.554-1.922 1.178-3.489 1.57-5.266 3.046-3.855 3.201-8.602 6.002-12.11 9.691-4.018 4.225-5.388 10.245-11.321 10.245"
      stroke-width="1.5px"
      pathLength="100"
      stroke="#22c55e"
    ></path>
  </svg>
  <p className="text-[1em] font-semibold text-green-600 [user-select:none]">Publish Course</p>
</label>
  
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" onClick={removeCourseHandler}>
            Remove Course
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course Title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Course description"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            ></textarea>
          </div>

          {/* Category, Level, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Level
              </label>
              <select
                name="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              >
                <option value="">Select Level</option>
                {levels.map((lvl, i) => (
                  <option key={i} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Course thumnil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course thumnil
            </label>
            <div className="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black w-48 h-36">
              <input
                type="file"
                name="thumnil"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <img
                src={
                  thumnil
                    ? URL.createObjectURL(thumnil)
                    : logo
                }
                alt="Course thumnil"
                className="w-32 h-24 object-cover rounded-lg"
              />
              <Pencil
                size={20}
                className="absolute top-2 right-2 text-gray-600"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
