import { useSelector } from "react-redux";
import CourseCard from "./CourseCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";



const Card = () => {
    
    const [courses, setCourses] = useState([]);

    const getAllCourses = async () => {
        try {
            const res = await axios.get( serverUrl + "/api/course/getAllCourses", { withCredentials: true });
            // const results = res.data;
            setCourses(res.data.slice(0, 6));
            console.log("All courses:", res);
            
        } catch (error) {
            console.log("getAllCourses err", error);
            
        }
        
    }
    
    useEffect(() => {
        getAllCourses();
    }, []);
    
    
    
    // console.log("in card",courses);
    // const courses = useSelector((state) => state.course.courseData);
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default Card;
