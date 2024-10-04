const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    // Extract data from the request body
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // Thumbnail
    const thumbnail = req.files.thumbnailImage;

    // Check for required fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the instructor exists
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details:", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // Check if the tag is valid
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag details not found",
      });
    }

    // Upload the thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Create the course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      tag: tagDetails._id,
    });

    // Add the new course to the user schema of the instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Update the tag schema to include the new course
    await Tag.findByIdAndUpdate(
      { _id: tagDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Return response
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Course created Failed",
    });
  }
};

// get all Courses handeler function

exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};


//getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
          //get id
          const {courseId} = req.body;
          //find course details
          const courseDetails = await Course.find(
                                      {_id:courseId})
                                      .populate(
                                          {
                                              path:"instructor",
                                              populate:{
                                                  path:"additionalDetails",
                                              },
                                          }
                                      )
                                      .populate("category")
                                      .populate("ratingAndreviews")
                                      .populate({
                                          path:"courseContent",
                                          populate:{
                                              path:"subSection",
                                          },
                                      })
                                      .exec();

              //validation
              if(!courseDetails) {
                  return res.status(400).json({
                      success:false,
                      message:`Could not find the course with ${courseId}`,
                  });
              }
              //return response
              return res.status(200).json({
                  success:true,
                  message:"Course Details fetched successfully",
                  data:courseDetails,
              })

  }
  catch(error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:error.message,
      });
  }
}