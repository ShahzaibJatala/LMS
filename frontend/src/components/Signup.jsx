import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/userSlice";
import signupimage from "../assets/logolms.jpeg"

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, email, password, role },
        { withCredentials: false }
      );
      console.log(result.data);
      setLoading(false);
      navigate("/login");
      toast.done("Signup successfully");
    } catch (error) {
      setLoading(false);
      console.log("Signup error", error);
      toast.error(error.response.data.message);
      navigate('/signup')
    }
  };




  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth,provider);
      console.log(response.user);
      const user = response.user;
      const Gname = user.displayName;
      const Gemail = user.email

      if (!Gname || !Gemail) {
        toast.error("Google account missing name or email.");
        return;
      }

      // console.log("Sending Google signup:", { Gname, Gemail, role });


      const result = await axios.post(serverUrl + "/api/auth/googleauth", {
        name: Gname, 
        email: Gemail,
        role: role || "student"
      }, {withCredentials:true});
      dispatch(setUserData(result.data));
      // console.log(result.data);
      toast.success("Signup successfully 🎉");
      navigate("/");
      
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error(error?.response?.data?.message || error?.response?.data?.error || "Google signup error");
      
    }    
  }

  // const num = (e) => {
  //     setName(e.target.value);
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Let’s get Started
          </h2>
          <p className="text-gray-500 text-sm mb-6">Create your account</p>

          <form className="space-y-4" onSubmit={(e) => handleSignup(e)}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password "
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-2 rounded-lg border ${
                  role === "student"
                    ? "bg-black text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`flex-1 py-2 rounded-lg border ${
                  role === "teacher"
                    ? "bg-black text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Educator
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg shadow hover:opacity-90 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin text-center"></div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Google Auth */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500 mb-2">
              Or continue with
            </p>
            <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg shadow-sm hover:bg-gray-50 transition cursor-pointer" onClick={googleSignUp}>
              <FcGoogle className="text-xl" />
              Google
            </button>
          </div>


          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
            {/* <div onClick={() => navigate('/login')} className="text-indigo-600 hover:underline">
              Login
            </div> */}
          </p>
        </div>

        {/* Right Section - Branding */}
        <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center">
          <div className="text-center">
            <img src={signupimage} alt="LOGO" className="h-60 ms-4" />
            <p className="mt-2 tracking-wide text-3xl">VIRTUAL COURSES</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
