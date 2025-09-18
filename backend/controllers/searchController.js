
import Course from "../models/courseModel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

function escapeRegex(str = "") {
  // escape regex special chars so user/AI text won't break Mongo regex
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const searchWithAi = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Query is required" });

    // Basic DB-first search (fast path)
    const initialResults = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { level: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    if (initialResults && initialResults.length > 0) {
      return res.status(200).json(initialResults);
    }

    // If no DB results, try AI to extract better search keywords
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not set — skipping AI fallback");
      return res.status(200).json({ message: "No courses found", courses: [] });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Prompt: request *only* comma-separated keywords to make parsing robust
    const prompt = `You are an AI assistant inside a Learning Management System (LMS).
Given the user query: "${query}"
Return up to 5 short keyword phrases (1-3 words each) that are the best search terms
to find relevant courses in a course database. **Respond with a single line of
comma-separated keywords only** (e.g. "mern, nodejs, react, express, mongodb"). No extra text.`;

    let aiResponse;
    try {
      aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    } catch (aiErr) {
      console.error("Gemini error:", aiErr);
      // If AI call fails, return no courses (or you can return initialResults which is empty)
      return res.status(200).json({ message: "No courses found", courses: [] });
    }

    // Robust extraction: try common shapes returned by the SDK
    const rawAiText =
      // primary (SDK examples show `.text` is often present)
      aiResponse?.text ??
      // some SDK responses put results in output[]/content[] entries
      aiResponse?.output?.[0]?.content?.find?.((c) => c.type === "output_text")?.text ??
      // sometimes content[] items use type 'text' or similar
      aiResponse?.output?.[0]?.content?.find?.((c) => c.type === "text")?.text ??
      // fallback: check candidates array
      aiResponse?.candidates?.[0]?.content?.[0]?.text ??
      // last resort
      "";

    const keywords = rawAiText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .slice(0, 5);

    if (keywords.length === 0) {
      // no keywords from AI => nothing to match
      return res.status(200).json({ message: "No courses found", courses: [] });
    }

    // Build regex clauses safely (escape special chars)
    const orClauses = [];
    for (const term of keywords) {
      const re = new RegExp(escapeRegex(term), "i");
      orClauses.push({ title: { $regex: re } });
      orClauses.push({ subTitle: { $regex: re } });
      orClauses.push({ description: { $regex: re } });
      orClauses.push({ category: { $regex: re } });
      orClauses.push({ level: { $regex: re } });
    }

    const aiCourses = await Course.find({ $or: orClauses }).limit(20);

    if (!aiCourses || aiCourses.length === 0) {
      return res.status(200).json({ message: "No courses found", courses: [] });
    }

    return res.status(200).json(aiCourses);
  } catch (error) {
    console.error("Search with AI error:", error);
    return res
      .status(500)
      .json({ message: `Search with AI error ${error.message ?? error}` });
  }
};
