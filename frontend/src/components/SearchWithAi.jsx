
import axios from "axios";
import { Search, ArrowLeft, Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { serverUrl } from "../App";
import start from '../assets/start.mp3';

const SearchWithAi = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const startSound = new Audio(start);

   function speak(message) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = message;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    }

    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const mic = new speechRecognition();
    mic.continuous = true;
    mic.interimResults = true;
    mic.lang = 'en-US';

    if(!mic){
        toast.dismiss("Speech Recognition not supported");
    }

    
    const handleSearch = async () => {
        if(!mic) return;
        mic.start();
        startSound.play();

        mic.onresult = (event) => {
            const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
            setInput(transcript);
            // handleRecommendation(transcript);
            console.log("transcript",transcript);
        }
    }

    useEffect(() => {
        const handleRecommendation = async (input) => {
            if (!input.trim()) return; // Don't search if input is empty
            
            setLoading(true);
            setError(null);
            
            try {
                const res = await axios.post(
                    `${serverUrl}/api/course/search`, 
                    { query: input }, 
                    { withCredentials: true }
                );
                
                // Ensure we always set an array
                const courses = Array.isArray(res.data) ? res.data : 
                              res.data.courses ? res.data.courses : [];
                              
                setRecommendations(courses);
                
                // if (courses.length === 0) {
                //     toast.info("No courses found for your search");
                // }
            } catch (err) {
                console.error("Search error:", err);
                setError(err.message);
                toast.error("Failed to search courses");
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce the search to avoid too many API calls
        const timeoutId = setTimeout(() => {
            if (input.trim()) {
                handleRecommendation(input);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [input]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-white flex flex-col items-center p-6">
            {/* Search Bar */}
            <div className="flex items-center w-full max-w-2xl bg-white rounded-2xl shadow-md px-4 py-2 text-black">
                <ArrowLeft 
                    className="mr-3 cursor-pointer" 
                    onClick={() => navigate("/")} 
                />
                <input
                    type="text"
                    placeholder="Ask anything about courses"
                    className="flex-1 bg-transparent outline-none text-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Search className="text-purple-500 cursor-pointer mr-3" />
                <Mic 
                    className="text-purple-500 cursor-pointer" 
                    onClick={handleSearch}
                />
            </div>

            {/* Results Section */}
            <div className="mt-10 text-center w-full max-w-6xl">
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-6">
                            {recommendations.length > 0 ? "AI Search Results" : "No courses found yet"}
                        </h2>
                        <div className="flex gap-6 justify-center flex-wrap">
                            {recommendations.map((rec, index) => (
                                <div
                                    key={rec._id || index}
                                    className="bg-white text-black p-6 rounded-xl shadow-md w-60 cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => navigate(`/course/${rec._id}`)}
                                >
                                    <h3 className="font-bold">{rec.title}</h3>
                                    <p className="text-gray-600 text-sm mt-2">{rec.category}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchWithAi;