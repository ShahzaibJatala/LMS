import React from "react";
import { CheckCircle } from "lucide-react";
import second from '../assets/male-student.jpg';

const About = () => {
  return (
    <section className="w-full py-12 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center md:items-start gap-10">
      {/* Left Section */}
      <div className="relative flex-1 flex justify-center w-full">
        {/* Main Image */}
        <img
          src={second}
          alt="Student"
          className="w-full max-w-sm md:max-w-md rounded-lg shadow-md object-cover"
        />

        {/* Video Overlay */}
        {/* <div className="absolute top-45 hidden md:block left-10 w-32 sm:w-40 md:w-44 lg:w-52 rounded-lg overflow-hidden shadow-lg">
          <video className="w-full h-full object-cover" controls>
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div> */}
      </div>

      {/* Right Section */}
      <div className="flex-1 text-center md:text-left">
        <p className="text-gray-200 mb-2 text-lg sm:text-base">About Us</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-4">
          We Are Maximize Your <br className="hidden sm:block" /> Learning Growth
        </h2>
        <p className="text-gray-300 mb-6 text-sm sm:text-base">
          We provide a modern Learning Management System to simplify online
          education, track progress, and enhance student-instructor
          collaboration efficiently.
        </p>

        {/* Features List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-600 w-5 h-5 shrink-0" />
            <span className="text-gray-300 text-sm sm:text-base">
              Simplified Learning
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-600 w-5 h-5 shrink-0" />
            <span className="text-gray-300 text-sm sm:text-base">
              Expert Trainers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-600 w-5 h-5 shrink-0" />
            <span className="text-gray-300 text-sm sm:text-base">
              Big Experience
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-600 w-5 h-5 shrink-0" />
            <span className="text-gray-300 text-sm sm:text-base">
              Lifetime Access
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
