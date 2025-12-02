
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify'
import { useSelector } from "react-redux";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import EditProfile from "./components/EditProfile";
import getCurrentUser from "./customHooks/getCurrentUser";
import Dashboard from "./components/Educator/Dashboard";
import EditCourse from "./components/Educator/EditCourse";
import CreateCourse from "./components/Educator/CreateCourse";
import Courses from "./components/Educator/Courses";
import ViewAllCourses from "./components/ViewAllCourses";
import CreateLacture from "./components/Educator/CreateLacture";
import EditLacture from "./components/Educator/EditLacture";
import Course from "./components/Course";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SearchWithAi from "./components/SearchWithAi";

export const serverUrl = "https://lms-lime-delta.vercel.app";

function App() {
  const user = useSelector((state) => state.user.userData);
  console.log(user);
  const stripePromise = loadStripe("pk_test_51S5mdQQwAp0pcu7JkCbsyFQt8ql7LEt61eRb0mopIRvR0gWs1C3HOgF8l6u6p98gDBfp2LSEICtdi1HNQiR9W0zu00EUTgTk0W");

  getCurrentUser();
  
  
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home className="overflow-hidden" />} />
        <Route path="/signup" element={ !user ? <Signup/> : <Navigate to={'/'}/>} />
        <Route path="/login" element= {<Login/>} />    
        <Route path="/profile" element= { user ? <Profile/> : <Navigate to={'/signup'} />} />    
        <Route path="/editprofile" element= { user ? <EditProfile/> : <Navigate to={'/signup'} />} />    
        <Route path="/forgot-password" element= { <ForgotPassword/> } />    
        <Route path="/search" element= { <SearchWithAi /> } />    
        <Route path="/dashboard" element= { user?.user?.role === "teacher" ? <Dashboard/> : <Navigate to={'/signup'} />} />
        <Route path="/editcourse/:courseId" element= { user?.user?.role === "teacher" ? <EditCourse/> : <Navigate to={'/signup'} />} />
        <Route path="/createcourse" element= { user?.user?.role === "teacher" ? <CreateCourse/> : <Navigate to={'/signup'} />} />
        <Route path="/createlacture/:courseId" element= { user?.user?.role === "teacher" ? <CreateLacture/> : <Navigate to={'/signup'} />} />
        <Route path="/editlacture/:courseId/:lactureId" element= { user?.user?.role === "teacher" ? <EditLacture/> : <Navigate to={'/signup'} />} />
        <Route path="/courses" element= { user?.user?.role === "teacher" ? <Courses/> : <Navigate to={'/signup'} />} />
        <Route path="/allcourses" element= { <ViewAllCourses /> } />
        <Route path="/course/:courseId" element= {
        <Elements stripe={stripePromise}>
           <Course />
        </Elements>
            } />
      </Routes>
    </>
  );
}

export default App;
