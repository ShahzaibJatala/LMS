import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import sideImage from '../assets/logolms.jpeg'


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  let role = "student"

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  const MIN_SPINNER_MS = 600;               // keep spinner visible at least 0.6s
  const start = Date.now();

  try {
    const result = await axios.post(
      serverUrl + "/api/auth/login",
      { email, password },
      { withCredentials: true }
    );

    dispatch(setUserData(result.data));
    // console.log(result.data);
    toast.success("Login successfully 🎉");
    navigate("/", { replace: true });       // route change
  } catch (error) {
    console.error("Login error", error);
    toast.error(error?.response?.data?.message || "Something went wrong");
    // optional: don't navigate on error so user can retry
  } finally {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_SPINNER_MS - elapsed);
    setTimeout(() => setLoading(false), remaining);
  }
};



const googleLogin = async () => {
  try {
    const response = await signInWithPopup(auth,provider);
    // console.log(response);
    const user = response.user;
    const Gname = user.displayName;
    const Gemail = user.email

    if (!Gname || !Gemail) {
      toast.error("Google account missing name or email.");
      return;
    }

    // console.log("Sending Google login:", { Gname, Gemail, role });


    const result = await axios.post(serverUrl + "/api/auth/googleauth", {
      name: Gname, 
      email: Gemail,
      role: role
    }, {withCredentials:true});
    dispatch(setUserData(result.data));
    // console.log(result.data);
    toast.success("Login successfully 🎉");
    navigate("/");
    
  } catch (error) {
    console.error("Google login error:", error);
    toast.error(error?.response?.data?.message || error?.response?.data?.error || "Google login error");
    
  }    
}




  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Let’s get Started
          </h2>
          <p className="text-gray-500 text-sm mb-6">Log into your account</p>

          <form className="space-y-4" onSubmit={(e) => handleLogin(e)}>
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
                  placeholder="Enter your password"
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

            {/* Submit */}
            <button
  type="submit"
  className={`w-full bg-black text-white py-2 rounded-lg shadow transition flex items-center justify-center
              ${loading ? "opacity-90 cursor-not-allowed" : "hover:opacity-90"}`}
  disabled={loading}
  aria-busy={loading}
  aria-disabled={loading}
>
  {loading && (
    <span className="mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  )}
  {loading ? "Logging in..." : "Login"}
  {/* Login */}
</button>

          </form>

          {/* Forgot Password */}
          <div className="flex mt-2 items-center justify-center">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
              // onClick={() => navigate('/forgot')}
            >
              Forgot password?
            </Link>
          </div>

          {/* Google Auth */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500 mb-2">
              Or continue with
            </p>
            <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg shadow-sm hover:bg-gray-50 transition cursor-pointer" onClick={googleLogin}>
              <FcGoogle className="text-xl" />
              Google
            </button>
          </div>

      {/* home navigate */}
<div className="flex items-center justify-center mt-3">
  {/* Button */}
  <button
    className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group shadow-md"
    type="button"
    onClick={() => navigate("/")}
  >
    <div
      className="bg-blue-500 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] 
      group-hover:w-[184px] z-10 duration-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        height="25px"
        width="25px"
        fill="#ffffff"  // arrow white for contrast
      >
        <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
        <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
      </svg>
    </div>
    <p className="translate-x-2">Home</p>
  </button>
</div>





          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Create new account{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Signup
            </Link>
            {/* <div onClick={() => navigate('/signup')} className="text-indigo-600 hover:underline">
              Signup
            </div> */}
          </p>
        </div>

        {/* Right Section - Branding */}
        <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center">
          <div className="text-center">
            <img src={sideImage} alt="LOGO" className="h-60 ms-4" />
            <p className="mt-2 tracking-wide text-3xl">VIRTUAL COURSES</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
