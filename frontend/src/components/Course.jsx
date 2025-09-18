
import { ArrowLeft, Star } from "lucide-react";
import logo from '../assets/empty.jpg'
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useState } from "react";
import img from '../assets/empty.jpg'
import { FaPlay } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { toast } from "react-toastify";


const Course = () => {
  const navigate = useNavigate();
  const {courseId} = useParams();
  const [courseDetails,setCourseDetails] = useState(null);
  const [lactures, setLactures] = useState([]);
  const [lactureDetails, setLactureDetails] = useState(null);
  const [video, setVideo] = useState("");
  const [CreatorCourses, setCreatorCourses] = useState([]); 
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [creator, setCreator] = useState("");
  const [formAppear, setFormAppear] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [accessibleLectures, setAccessibleLectures] = useState([]);

   
  
  // const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: ""
  });

  
  // review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Rating:", rating);
    // console.log("Review:", review);
     try {
        const res = await axios.post(serverUrl + "/api/course/addReview/" + courseId, {rating: rating, review: review}, { withCredentials: true });
        // console.log("Review submission response:", res.data);
      
    } catch (error) {
      console.log("add review err", error.response?.data || error.message, error);
    }
    courseDetails?.reviews.push({rating: rating, review: review});
    console.log("Updated course reviews:", courseDetails?.reviews);
    setReview("");
    setRating(0);
    setHover(0);
    // send to backend here
  };

  const handleLacture = (videoUrl, lectureId) => {
  if (!videoUrl) {
    toast.error("Video not available");
    return;
  }
  
  if (!isEnrolled && !accessibleLectures.includes(lectureId)) {
    toast.error("Please enroll in the course to access this lecture");
    return;
  }
  
  setVideo(videoUrl);
};

const handlePaymentSuccess = async () => {
 try {
    // Call the payment endpoint first
    await axios.post(
      `${serverUrl}/api/payment/paymentLacture/${courseId}`,
      {},
      { withCredentials: true }
    );

    // Then update local state
    setFormAppear(false);
    setIsEnrolled(true);
    
    // Refresh accessible lectures
    const { data } = await axios.get(
      `${serverUrl}/api/course/check-enrollment/${courseId}`,
      { withCredentials: true }
    );
    setAccessibleLectures(data?.accessibleLectures);
  } catch (error) {
    console.error("Error processing enrollment:", error);
    alert("There was an error processing your enrollment. Please try again.");
  }
};
  
  
  useEffect(() => {
   const fetchCourseDetails = async () => {
    try {
      setLactures([]);         // clear old lectures
      setLactureDetails(null); // clear old lecture details
      setVideo("");            // clear video

      const course = await axios.post(
        `${serverUrl}/api/course/getCourseById/${courseId}`,
        {},
        { withCredentials: true }
      );

      setCourseDetails(course?.data);
      // console.log("courdeoifeofi",course?.data?.reviews);
      setLactures(course?.data?.lactures);
      console.log("revie", course?.data?.reviews);
      
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  
  const fetchCreatorLacture = async () => {
    try {
      const res = await axios.get(serverUrl + "/api/course/getCreatorCourses",
        { withCredentials: true });
        setCreatorCourses(res?.data);
        console.log("creator lectures:", res.data);
        
        
      } catch (error) {
        console.log("fetch creator lacture error", error);
        
      }
      
    }

    const getCreator = async () => {
      try {
        const creator = await axios.get(serverUrl + "/api/course/getCreator/" + courseId, {withCredentials:true});
        // console.log(creator.data);
        setCreator(creator.data)
        
      } catch (error) {
        console.log("get creator error", error);
        
      }
    }

    
    fetchCourseDetails();
    fetchCreatorLacture();
    getCreator();
    
  },[courseId])

  useEffect(() => {
const fetchLactureDetails = async () => {
    try {
      setLactureDetails(null); // Reset before fetching
      
      if (!lactures || lactures.length === 0) return;

      const results = await Promise.all(
        lactures.map(async (id) => {
          try {
            const response = await axios.get(
              `${serverUrl}/api/course/lactureDetails/${id}`,
              { withCredentials: true }
            );
            return {
              ...response.data,
              isLocked: false
            };
          } catch (error) {
            if (error.response?.status === 403) {
              // Return lecture with locked status
              return {
                _id: id,
                lactureTitle: "Locked Lecture",
                isLocked: true,
                message: error.response.data.message
              };
            }
            throw error;
          }
        })
      );

      setLactureDetails(results);
    } catch (error) {
      console.error("Fetch lectures error:", error);
      toast.error("Lectures not loading");
    }
  };


  const checkEnrollment = async () => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/course/check-enrollment/${courseId}`,
        { withCredentials: true }
      );
      setIsEnrolled(data?.isEnrolled);
      setAccessibleLectures(data?.accessibleLectures);
    } catch (error) {
      console.error("Error checking enrollment:", error);
      // Don't reset enrollment status on error
      // This prevents losing enrollment state on refresh
    }
  };

  if (courseId) {
    checkEnrollment();
  }

  fetchLactureDetails();
}, [lactures, courseId]); // runs only when lactures change


  return (
    <div className="p-6 space-y-10 bg-gray-600 min-h-screen">
      <button
          className="absolute top-1 left-1 text-gray-300 hover:text-blue-400 transition"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={26} />
        </button>
      {/* Top Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <img
            src={courseDetails?.thumnil ? courseDetails?.thumnil : logo}
            alt="thumbnail"
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{courseDetails?.title}</h2>
          <p className="text-gray-600">{courseDetails?.category}</p>
          <div className="flex items-center gap-2 text-yellow-500">
            <Star className="w-5 h-5 fill-yellow-500" />
            <span>{courseDetails?.reviews ? courseDetails?.reviews.length : 0 }  Review</span>
          </div>
          <p className="text-2xl font-bold text-green-600">${courseDetails?.price ? courseDetails?.price : "Free" }</p>
          <ul className="space-y-2 text-slate-300 ">
            <li>{courseDetails?.description}</li>
          </ul>
          {courseDetails?.price > 0 ? (
  isEnrolled ? (
    <div className="text-green-600 font-semibold">✓ Enrolled</div>
  ) : (
    <button
      className="w-full md:w-auto bg-black text-white px-4 py-2 rounded-2xl shadow-md hover:bg-gray-800"
      onClick={() => setFormAppear(true)}
    >
      Enroll Now - ${courseDetails?.price}
    </button>
  )
) : (
  // Replace the existing free enrollment button with this
<button
  className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-2xl shadow-md hover:bg-green-700"
  onClick={() => handlePaymentSuccess()}
>
  Enroll Free
</button>
)}

{formAppear && (
  <PaymentForm
    courseId={courseId}
    price={courseDetails?.price}
    onSuccess={handlePaymentSuccess}
    onCancel={() => setFormAppear(false)}
  />
)}      
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div>
  <h3 className="text-lg font-semibold mb-3">Course Curriculum</h3>
  {!lactureDetails || lactureDetails.length === 0 ? (
    <p className="text-gray-600">No lectures available.</p>
  ) : (
    lactureDetails?.map((lecture, index) => (
  <div
    key={lecture._id || index}
    className={`bg-slate-300 relative p-3 border rounded-2xl shadow-sm mb-1 h-20 ${
      lecture.isLocked 
        ? "opacity-50 cursor-not-allowed" 
        : "cursor-pointer hover:bg-gray-50"
    }`}
    onClick={() => {
      if (lecture.isLocked) {
        toast.error(lecture.message || "Please enroll to access this lecture");
        return;
      }
      handleLacture(lecture.videoUrl, lecture._id);
    }}
  >
    <p className="font-medium">Lecture {index + 1}</p>
    <div className="mt-1">
      <p className="text-blue-600">
        {lecture.lactureTitle}
      </p>
    </div>
    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
      {lecture.isLocked ? <FaLock /> : <FaPlay />}
    </span>
  </div>
)))}
</div>

        <div>
          <video
            src={video}
            controls
            className="w-full h-90 rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Creator profile */}
       <div className="w-full max-w-lg mx-auto bg-slate-300  border-t border-gray-400 p-4 flex items-center gap-4 shadow rounded-lg">
      {/* Profile Image */}
      <img
        src={creator?.photoURL ? creator?.photoURL : img}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover border"
      />

      {/* User Info */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">{creator?.name}</h2>
        <p className="text-sm text-gray-700">{creator?.description}</p>
        <p className="text-sm text-gray-600">{creator?.email}</p>
      </div>
    </div>


      {/* user reviews  */}

      <h2 className="text-lg font-semibold mb-3">Reviews</h2>

      {courseDetails?.reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {courseDetails?.reviews.map((review, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm bg-slate-300 "
            >
              {/* Reviewer name + stars */}
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-800">
                  {review?.review || "Anonymous"}
                </p>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={16}
                      className={
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Review text */}
              <p className="text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      )}




 {/* Reviews */}
      <h2 className="text-lg font-semibold mb-2">Write a Review</h2>
       <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <FaStar
              key={i}
              size={24}
              className={`cursor-pointer transition-colors ${
                starValue <= (hover || rating)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            />
          );
        })}
      </div>


      {/* Review Textarea */}
      <textarea
  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
  rows="4"
  placeholder="Write your review here..."
  value={review}
  onChange={(e) => setReview(e.target.value)}
/>

{/* Submit Button */}
<button
  onClick={handleSubmit}
  className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
>
  Submit Review
</button>


      {/* Other Courses Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Other Published Courses by the Educator</h3>
        <div className="grid md:grid-cols-3 gap-6">
        {CreatorCourses.length === 0 ? <p>No other course Published by this Educator </p> : 
        CreatorCourses?.map((course) => (
          <div className="border rounded-2xl shadow-sm overflow-hidden" key={course._id} onClick={() => navigate(`/course/${course._id}`)}>
            <img src={course?.thumnil ? course?.thumnil : img} alt="HTML Course" className="w-full" />
            <div className="p-4">
              <h4 className="font-semibold">{course?.title}</h4>
              <p className="text-gray-600">{course?.category}</p>
              <p className="mt-2 font-bold">{course?.price ? "$" + course?.price : "Free"}</p>
            </div>
          </div>
))}
        </div>
      </div>
    </div>
  );
};

export default Course;
