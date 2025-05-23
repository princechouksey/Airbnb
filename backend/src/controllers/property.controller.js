const Property = require("../models/property.model");
const CustomError = require("../utils/customError");
const cacheClient = require("../services/cache.services");
const Review = require("../models/review.model.js")
const User = require("../models/user.model.js")

module.exports.createPropertyController = async (req, res, next) => {
  try {
    const { title, description, price, location, amenities, images } = req.body;

    if (
      !title &&
      !description &&
      !price &&
      !location &&
      !amenities &&
      !images
    ) {
      return next(new CustomError("All fields is required", 400));
    }
    const newProperty = await Property.create({
      title,
      description,
      price,
      amenities,
      location,
      images,
      host: req.user._id,
    });
    if (!newProperty) {
      return next(new CustomError("Error in Creating Property ", 400));
    }
     // Add the propertyId to the properties array of the user who created it
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

     // Push the new propertyId into the user's properties array
    user.properties.push(newProperty._id);

    // Save the updated user document
    await user.save();
    res
      .status(201)
      .json({ message: "Propety created successfully", data: newProperty });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.deletePropertyContoller = async (req,res,next)=>{
     try{
        const {id} = req.params;
        const deletedProperty =await  Property.findByIdAndDelete(id);
        if(!deletedProperty) return next(new CustomError("Error in Deleting Property", 400))
        res.status(200).json({message: "property deleted successfully "})
     }
     catch(err){
        return next(new CustomError(err.message, 500))
     }


}
module.exports.updatePropertyController =async (req,res,next)=>{
    try {
        const { id } = req.params;
        console.log("req.body--->", req.body)
        console.log("id--->", id);
        
        
    
        if (!id) return next(new CustomError("property id is required", 400));
    
        const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
    
        if (!updatedProperty)
          return next(new CustomError("Error in updating property", 400));
    
        res.status(200).json({
          message: "Property updated successfully",
          data: updatedProperty,
        });
      } catch (error) {
        next(new CustomError(error.message, 500));
      }
};

    module.exports.viewPropertyController = async (req, res, next) => {
        try {
          const { id } = req.params;
          if (!id) return next(new CustomError("property id is required", 400));
      
          const propertyDetails = await Property.findById(id);
          if (!propertyDetails)
            return next(new CustomError("Error in fetching property data", 400));
      
          res.status(200).json({
            message: "Property fetched successfully",
            data: propertyDetails,
          });
        } catch (error) {
          next(new CustomError(error,500))
        }
};

module.exports.searchPropertyController = async (req, res, next) => {
    try {
        const { location, minPrice,maxPrice } = req.body;

        const query = {
            ...(location && { location: { $regex: location, $options: "i" } }),
            ...(minPrice && { price: { $gte: minPrice } }),
            ...(maxPrice && { price: { $lte: maxPrice } }),
        }
        // console.log('query--->', query);
        
        const property = await Property.find(query)
        // console.log('property--->', property);
        
        if (!property) return next(new CustomError("Property not found", 400));
 
     res.status(200).json({
       message: "Properties fetched",
       data: property,
     });
   } catch (error) {
        next(new CustomError(error.message, 500));
   }
 };
 


 module.exports.viewAllPropertyController = async (req, res, next) => {
  try {
    
    const propertyDetails = await Property.find();
    if (!propertyDetails)
      return next(new CustomError("Error in fetching property data", 400));

    res.status(200).json({
      message: "Property fetched successfully",
      data: propertyDetails,
    });
  } catch (error) {
    next(new CustomError(error))
  }
};

// Function to get all reviews for a specific property
// controllers/reviewController.js
module.exports.getReviewsByPropertyId = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const reviews = await Review.find({ property: propertyId })
      .populate({path:'user', select:"username"})
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
