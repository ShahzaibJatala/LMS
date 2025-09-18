import Stripe from "stripe";
import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../models/courseModel.js";
import Lacture from "../models/lactureModel.js";
import User from "../models/userModel.js";

export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(404).json({ message: "Title or Category is required" });
    }

    const course = await Course.create({
      title,
      category,
      creator: req.userId,
    });

    return res.status(200).json(course);
  } catch (error) {
    return res.status(404).json({ message: "Create course error" });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });

    if (!courses) {
      return res.status(404).json({ message: "Courses not found" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(404).json({ message: "Cannot found published courses" });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({ message: "Courses not found" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(404).json({ message: "Cannot found creator courses" });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      isPublished,
    } = req.body;
    let thumnil;
    if (req.file) {
      thumnil = await uploadOnCloudinary(req.file.path);
    }

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Courses not found" });
    }

    const updateData = {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      isPublished,
      thumnil,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json(course);
  } catch (error) {
    return res.status(404).json({ message: "Cannot found creator courses" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { review, rating } = req.body;
    if (!review || !rating) {
      return res.status(404).json({ message: "Review and rating is required" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.reviews.push({ review, rating });
    await course.save();

    res.status(200).json(course);
  } catch (error) {
    return res.status(404).json({ message: "Cannot add review" });
  }
};

export const getCreatorByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(400).json({ message: "Course not found" });
    }

    const creatorId = course.creator;
    const creator = await User.findById(creatorId);

    res.status(200).json(creator);
  } catch (error) {
    return res.status(404).json({ message: "Cannot find creator" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(404).json({ message: "Cannot found course by id" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    let courses = await Course.find();
    if (!courses) {
      return res.status(404).json({ message: "Courses not found" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(404).json({ message: "Cannot found courses" });
  }
};

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    let course = await Course.findByIdAndDelete(courseId, { new: true });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course removed" });
  } catch (error) {
    return res.status(404).json({ message: "Cannot course delete" });
  }
};

// lactures controllers

export const createLacture = async (req, res) => {
  console.log("createLacture req.body:", req.body);

  try {
    const { lactureTitle } = req.body;
    const { courseId } = req.params;
    if (!lactureTitle || !courseId) {
      return res.status(404).json({ message: "Lacture title is required" });
    }
    const lacture = await Lacture.create({ lactureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lactures.push(lacture._id);
    }
    await course.populate("lactures");
    await course.save();

    return res.status(200).json({ lacture, course });
  } catch (error) {
    return res.status(404).json({ message: "Lacture Cannot be created" });
  }
};

export const getCourseLactures = async (req, res) => {
  console.log("get coiurse lactures called");

  try {
    const { courseId } = req.params;
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    await course.populate("lactures");
    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    return res.status(404).json({ message: "Cannot get lactures" });
  }
};

export const editLacture = async (req, res) => {
  try {
    const { lactureId } = req.params;
    const { lactureTitle, isPriviewFree } = req.body;
    const lacture = await Lacture.findById(lactureId);
    if (!lacture) {
      return res.status(404).json({ message: "Lacture not found" });
    }

    let videoUrl;
    if (req.file) {
      videoUrl = await uploadOnCloudinary(req.file.path);
      lacture.videoUrl = videoUrl;
    }
    if (lactureTitle) lacture.lactureTitle = lactureTitle;
    lacture.isPriviewFree = isPriviewFree;
    await lacture.save();
    return res.status(200).json(lacture);
  } catch (error) {
    return res.status(404).json({ message: "Cannot edit lacture" });
  }
};

// export const paymentLacture = async (req, res) => {
//   try {
//     // const userId = "68abf74bf3031f3db8a4b6d2"; // replace with req.userId after auth
//     const userId = req.userId;
//     const { courseId } = req.params; // or req.body

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const course = await Course.findById(courseId).populate("lactures");
//     if (!course) return res.status(404).json({ message: "Course not found" });

//     // Enroll course if not already
//     if (!user.enrolledCourses.includes(courseId)) {
//       user.enrolledCourses.push(courseId);
//     }

//     // Unlock all course lectures for this user only
//     for (const lecture of course.lactures) {
//       if (!user.unlockedLectures.includes(lecture._id)) {
//         user.unlockedLectures.push(lecture._id);
//       }
//     }

//     await user.save();

//     return res.status(200).json({
//       message: "Course purchased. Lectures unlocked for this user only.",
//       unlockedLectures: user.unlockedLectures,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Cannot process payment lecture" });
//   }
// };

export const lactureDetails = async (req, res) => {
  try {
    const { lactureId } = req.params;
    const userId = req.userId;

    // Find the lecture first
    const lecture = await Lacture.findById(lactureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // If lecture is free preview, return it immediately
    if (lecture.isPriviewFree) {
      return res.status(200).json({
        ...lecture.toObject(),
        isLocked: false
      });
    }

    // If not free, check user authentication and enrollment
    if (!userId) {
      return res.status(403).json({
        message: "Please login to access this lecture",
        isLocked: true
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the course that contains this lecture
    const course = await Course.findOne({ lactures: lactureId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is enrolled in the course
    const isEnrolled = user.enrolledCourses.includes(course._id);
    
    if (!isEnrolled) {
      return res.status(403).json({
        message: "Please enroll in the course to access this lecture",
        isLocked: true
      });
    }

    return res.status(200).json({
      ...lecture.toObject(),
      isLocked: false
    });

  } catch (err) {
    console.error("Lecture details error:", err);
    return res.status(500).json({ message: "Error fetching lecture" });
  }
};

export const removeLacture = async (req, res) => {
  try {
    const { lactureId } = req.params;
    let lacture = await Lacture.findByIdAndDelete(lactureId, { new: true });
    if (!lacture) {
      return res.status(404).json({ message: "Lacture not found" });
    }
    await Course.updateOne(
      { lactures: lactureId },
      { $pull: { lactures: lactureId } }
    );
    return res.status(200).json({ message: "Lacture removed" });
  } catch (error) {
    return res.status(404).json({ message: "Cannot remove lacture" });
  }
};

// payment controllers
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentGateway = async (req, res) => {
    console.log("payment");
    
  try {
    // const { amount, currency } = req.body;
    const amount = 5000;
    const currency = "usd";

    if (!amount || !currency) {
        console.log("Amount and currency are required");
        
      return res
        .status(400)
        .json({ error: "Amount and currency are required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log("Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
};




// Add this new controller
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is enrolled
    const isEnrolled = user.enrolledCourses.includes(courseId);

    // Get all accessible lectures (free previews + unlocked lectures)
    const accessibleLectures = await Lacture.find({
      _id: { $in: course.lactures },
      $or: [
        { isPriviewFree: true },
        { _id: { $in: user.unlockedLectures } }
      ]
    }).select('_id');

    return res.status(200).json({
      isEnrolled,
      accessibleLectures: accessibleLectures.map(lecture => lecture._id)
    });
  } catch (error) {
    console.error("Check enrollment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update your paymentLacture controller to save enrollment
export const paymentLacture = async (req, res) => {
  // console.log("payment called");
  try {
    const { courseId } = req.params;
    // const userId = "68c6c09f63948883d8818a8d"; // later use req.userId
    const userId = req.userId;
    // console.log("courseId:", courseId, "userId:", userId);
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      // console.log("User not found");
      
      return res.status(404).json({ message: "User not found" });
    }


    // Find the course and populate lectures
    const course = await Course.findById(courseId).populate("lactures");
    if (!course) {
      console.log("Course not found");
      
      return res.status(404).json({ message: "Course not found" });
    }

    course.enrollStudent.push(userId);

    // Add course to enrolled courses if not already enrolled
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
    }

    // Unlock all course lectures for this user + make preview free
    const lectureIds = course.lactures.map(lecture => lecture._id);
    // console.log("lactureIds:", lectureIds);
    
    // Update all lectures in DB → set isPriviewFree = true
    await Lacture.updateMany(
      { _id: { $in: lectureIds } },
      { $set: { isPriviewFree: true } }
    );

    // Also push to unlockedLectures in user
    lectureIds.forEach(lectureId => {
      if (!user.unlockedLectures.includes(lectureId)) {
        user.unlockedLectures.push(lectureId);
      }
    });

    await user.save();
    await course.save();

    return res.status(200).json({
      message: "Course enrolled successfully, all lectures unlocked & marked free",
      isEnrolled: true,
      unlockedLectures: user.unlockedLectures,
    });
  } catch (error) {
    console.error("Payment lecture error:", error);
    return res.status(500).json({ message: "Failed to process enrollment" });
  }
};
