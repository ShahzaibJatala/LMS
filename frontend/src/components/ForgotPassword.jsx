import React, { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid"; // install: npm i @heroicons/react
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [otp,setOtp] = useState("");
  const [password,setPassword] = useState("");
  const [cpassword,setcPassword] = useState("");
  const [loading,setLoading] = useState(false);


  const handleemail = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/auth/sendOTP", { email } ,{ withCredentials : false });
      console.log(result.data);
      setStep(2);    
      
    } catch (error) {
      toast.error("OTP is not sended try with email which is signined");
    }
  }

  const verifyOtp = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/auth/verifyOTP", {email, otp}, {withCredentials:false});
      console.log(result);
      setStep(3);
      
    } catch (error) {
      toast.error("Correct OTP required");      
    }
  }

  const resetPassword = async () => {
    try {
      if(password !== cpassword) {
        toast.info("password is not match");
      }
      const result = await axios.post(serverUrl + "/api/auth/resetPassword", {email, password}, {withCredentials:false});
      console.log(result);
      setLoading(true)
      
    } catch (error) {
      toast.error("Enter password greater than 8 character");      
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header with back button */}
        <div className="flex items-center space-x-3 mb-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="p-1 rounded-full hover:bg-gray-200 transition"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="p-1 rounded-full hover:bg-gray-200 transition"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}


          <h2 className="text-2xl font-semibold text-gray-800">
            Forgot Password
          </h2>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">

            <label className="block text-gray-600 text-sm font-medium">
              Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your E-mail" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-black/30"
            />
            <button
              onClick={ handleemail }
              className="w-full py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-gray-600 text-sm font-medium">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-black/30"
            />
            <button
              onClick={() => verifyOtp()}
              className="w-full py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              Verify OTP
            </button>
            Enter OTP in 5 minutes
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-gray-600 text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-black/30"
            />
            <label className="block text-gray-600 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password" required
              value={cpassword}
              onChange={(e) => setcPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-black/30"
            />
            <button
              onClick={() => resetPassword()}
              className="w-full py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              Reset Password
            </button>
            {loading && (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 bg-white text-black rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              Login
            </button>
            )}
          </div>
        )}


      </div>
    </div>
  );
}

export default ForgotPassword;
