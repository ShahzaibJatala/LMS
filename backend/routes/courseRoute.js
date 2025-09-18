
import express from 'express'
import { addReview, checkEnrollment, createCourse, createLacture, editCourse, editLacture, getAllCourses, getCourseById, getCourseLactures, getCreatorByCourse, getCreatorCourses, getPublishedCourses, lactureDetails, removeCourse, removeLacture } from '../controllers/courseController.js';
import isAuth from '../middleware/isAuth.js';
import upload from '../middleware/multer.js';
import { searchWithAi } from '../controllers/searchController.js';

const courseRoute = express.Router();

// course routes
courseRoute.post("/create",isAuth, createCourse); 
courseRoute.get("/getpublish", getPublishedCourses);
courseRoute.get("/getCreatorCourses", isAuth, getCreatorCourses); 
courseRoute.post("/editCourse/:courseId",isAuth, upload.single("thumnil") , editCourse);
courseRoute.post("/getCourseById/:courseId",isAuth, getCourseById);
courseRoute.get("/getAllCourses", getAllCourses);
courseRoute.post("/removeCourse/:courseId",isAuth, removeCourse);
courseRoute.post("/addReview/:courseId",isAuth, addReview);
courseRoute.get("/getCreator/:courseId",getCreatorByCourse);

// Lactures routes
courseRoute.post("/createlacture/:courseId", isAuth, createLacture);
courseRoute.get("/getCourseLactures/:courseId", isAuth, getCourseLactures);
courseRoute.get("/lactureDetails/:lactureId", lactureDetails);
courseRoute.post("/getCourseLactures/:lactureId", isAuth, upload.single("videoUrl"), editLacture);
courseRoute.delete("/removecourse/:lactureId", isAuth, removeLacture);




courseRoute.get("/check-enrollment/:courseId", isAuth, checkEnrollment);


// for search 
courseRoute.post("/search", searchWithAi);

export {courseRoute}