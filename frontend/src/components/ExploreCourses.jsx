import { Monitor, Layers3, Smartphone, Shield, Zap, Share2, BarChart3, Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ExplorerCourses() {
  const courses = [
    {
      id: 1,
      title: "Web Development",
      icon: Monitor,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      id: 2,
      title: "UI UX Designing",
      icon: Layers3,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      id: 3,
      title: "App Development",
      icon: Smartphone,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      id: 4,
      title: "Ethical Hacking",
      icon: Shield,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      id: 5,
      title: "AI/ML",
      icon: Zap,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      id: 6,
      title: "Data Science",
      icon: Share2,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      id: 7,
      title: "Data Analytics",
      icon: BarChart3,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      id: 8,
      title: "AI Tools",
      icon: Boxes,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    }
  ];

  const navigate = useNavigate();

  return (
    <div className="bg-slate-500 min-h-screen p-8 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight" >
                Explore<br />
                Our Courses
              </h1>

              <p className="text-gray-200 text-lg leading-relaxed max-w-md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem vel 
                iure explicabo laboriosam accusantium expedita laudantium 
                facere magnam.
              </p>
            </div>
            
            <button className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center gap-3 group" onClick={() => navigate('/allcourses')}>
              Explore Courses
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Right Content - Course Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {courses.map((course) => {
              const IconComponent = course.icon;
              return (
                <div
                  onClick={() => navigate('/allcourses')}
                  key={course.id}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className={`${course.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${course.iconColor}`} />
                    </div>
                    <h3 className="text-gray-800 font-semibold text-lg group-hover:text-gray-900">
                      {course.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
