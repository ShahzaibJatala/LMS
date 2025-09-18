import { Star } from "lucide-react";
import logo from '../assets/empty.jpg'
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  // console.log("course card", course.thumnil);
  const navigate = useNavigate();
  
  return (
    <div className="w-80 bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition" onClick={() =>  navigate(`/course/${course?._id}`)}>
      {/* Thumbnail */}
      <img
        src={course?.thumnil ? course?.thumnil : logo}
        alt={course?.title}
        className="w-full h-44 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {course?.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{course?.category}</p>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-800">${course?.price}</span>

          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={18} fill="gold" stroke="gold" />
            <span className="text-sm font-medium text-gray-600">{course?.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
