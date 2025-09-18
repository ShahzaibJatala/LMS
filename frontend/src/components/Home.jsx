import React from 'react'
import Nav from './Nav'
import { motion } from "framer-motion";
import getCurrentUser from '../customHooks/getCurrentUser';
import FeaturesBar from './FeatureBar';

import firstimg from "../assets/young-student-woman.jpg";
import secondimg from "../assets/male-student.jpg"
import thirdimg from "../assets/laptop-computer-pink.jpg"
import ExploreCourses from './ExploreCourses';
import Card from './Card';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import About from './About';
import Footer from './Footer';

function Home() {

  const navigate = useNavigate();

  getCurrentUser();
  const courses = useSelector((state) => state.course);
  console.log(courses);
  return (
    <>

      <Nav className="overflow-hidden"/>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-white flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Background Overlay */}
        {/* <div className="absolute inset-0 bg-[url('/bg-texture.png')] opacity-10"></div> */}

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center max-w-3xl leading-snug z-10 text-slate-200"
        >
          Grow Your Skills to Advance <br /> Your Career Path
        </motion.h1>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex gap-4 z-10 flex-wrap"
        >
          <div className="flex gap-4 justify-center mt-6">
            <button className="bg-white text-black px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition cursor-pointer" onClick={() => navigate('/allcourses')}>
              View All Courses
            </button>

            <button className="relative px-6 py-3 rounded-full border border-white font-medium overflow-hidden group">
              {/* Text with gradient on hover */}
              <span className="relative z-10 transition-colors duration-500 bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 animate-gradient-x" onClick={() => navigate('/search')}>
                Search With AI
              </span>

              {/* Background gradient on hover */}
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 animate-gradient-x"></span>
            </button>


          </div>
        </motion.div>

        {/* Floating Avatars */}
        <div className="flex gap-6 mt-12 z-10 flex-wrap justify-center">
          <motion.img
            src={firstimg}
            alt="Student 1"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-800 shadow-xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.img
            src={secondimg}
            alt="Student 2"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-800 shadow-xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.img
            src={thirdimg}
            alt="Student 3"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-800 shadow-xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
        <FeaturesBar />
        <ExploreCourses />
        <h1 className="text-4xl font-extrabold text-white mb-4 mt-8">Our Popular Courses</h1>
        <p className='mb-8'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae, perferendis!</p>
        <Card />

        <About />

        <Footer />

      </div>


    </>


  )
}

export default Home