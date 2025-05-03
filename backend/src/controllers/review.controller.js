const Review= require("../models/review.model");


const createReviewController = async (req, res, next) => {

    try {
        const {ratings, comment, property_id}    = req.body;
        if (!ratings || !comment || !property_id) return res.status(400).json({message: "All fields are required"});
        const review = await Review.create({
            property: property_id,
            user: req.user._id,
            ratings,
            comment
        });
        if(!review) return res.status(400).json({message: "Review not created"});
        res.status(200).json({
            success: true,
            message: "Review created successfully",
            data: review
        });


    } catch (error) {
          next(new CustomError(error.message, 500));

    }
}

const deleteReviewController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({message: "Review id is required"});
        const deleteReview = await Review.findByIdAndDelete(id);
        if (!deleteReview) return res.status(400).json({message: "Review not found"});
        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        next(new CustomError(error.message, 500));
        
    }


}

const updateReviewController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({message: "Review id is required"});
        const {ratings, comment} = req.body;
        if (!ratings || !comment) return res.status(400).json({message: "All fields are required"});
        const updateReview = await Review.findByIdAndUpdate(id, req.body,  {new: true, runValidators: true});
        if (!updateReview) return res.status(400).json({message: "Review not found"});
        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: updateReview
        });
    } catch (error) {
        next(new CustomError(error.message, 500));
        
    }
}

const getReviewController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({message: "Review id is required"});
        const review = await Review.findById(id)
        if(!review) return res.status(400).json({message: "Review not found"});
        res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            data: review
        });

    } catch (error) {
        next(new CustomError(error.message, 500));
        
    }

}

module.exports = {
    createReviewController,
    deleteReviewController,
    updateReviewController,
    getReviewController
}