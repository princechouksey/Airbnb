import React, { useEffect, useState } from "react";
import Footer from "./partials/Footer";
import BookingCard from "./partials/BookingCard";
import { useParams } from "react-router-dom";
import {
  getSingleProperty,
  getReviewByPropertyId,
} from "../API/propertyService";
import axios from "../API/axiosConfig.js";
import { createReview} from "../API/reviewService.js"

const ratings = [
  { label: "Cleanliness", value: "5.0", icon: "ri-sparkling-line" },
  { label: "Accuracy", value: "5.0", icon: "ri-checkbox-circle-line" },
  { label: "Check-in", value: "5.0", icon: "ri-key-line" },
  { label: "Communication", value: "4.9", icon: "ri-chat-4-line" },
  { label: "Location", value: "5.0", icon: "ri-map-pin-line" },
  { label: "Value", value: "4.9", icon: "ri-price-tag-3-line" },
];

const SingleProperty = () => {
  const [singleProperty, setSingleProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const [nightRate] = useState(1000);
  const [cleaningFee] = useState(100);
  const [average, setAverage] = useState(0);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getSingleProperties = async () => {
      const res = await getSingleProperty(id);
      setSingleProperty(res?.data?.data);
    };

    const getReviews = async () => {
      const res = await getReviewByPropertyId(id);
      setReviews(res?.data);
    };

    getSingleProperties();
    getReviews();
  }, [id]);

  function calculateAverageRating(reviews, id) {
    // Filter reviews for the given property ID
    
    if (reviews.length === 0) return 0;
  
    // Calculate the total ratings
    const totalRatings = reviews.reduce(
      (acc, curr) => acc + curr.ratings, 0
    );
  
    // ✅ Return average
    return (totalRatings / reviews.length).toFixed(1);
  }
  
  useEffect(() => {
    if (reviews.length > 0) {
      setAverage(calculateAverageRating(reviews, id));
    }
  }, [reviews, id]);

  const handleSubmitReview = async (e) => {
  e.preventDefault();

  if (!comment.trim()) {
    setError("Please add a comment for your review");
    return;
  }

  setIsSubmitting(true);
  setError("");

  try {
    const res = await createReview({ property_id: id, ratings: rating, comment });
    console.log(res?.data?.data)

     const newReview = {
      ...res, // assuming your backend returns created review object
      user: { username: "You" }, // or fetch from auth context
    };

    setReviews([newReview, ...reviews]);

    setComment("");
    setRating(5);
    setError("");

    // Optional: Update review count in singleProperty
    setSingleProperty((prev) => ({
      ...prev,
      totalReview: prev.totalReview + 1,
    }));
  } catch (error) {
    console.log(error);
    setError("Failed to submit review. Try again later.");
  } finally {
    setIsSubmitting(false);
  }
};


  if (!singleProperty) return <div>Loading...</div>;

  return (
    <div className="h-full w-full bg-zinc-50 pt-28 px-40">
      {/* Images */}
      <div className="flex w-full gap-2 h-[60vh] rounded-2xl overflow-hidden mb-5">
        <div className="w-1/2 h-full relative">
          <div className="w-full h-full absolute top-0 left-0 hover:bg-black/[.2] cursor-pointer duration-[.2s]" />
          <img
            src={singleProperty.images?.[0]}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col gap-2">
          <div className="w-full h-1/2 flex gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="w-1/2 h-full relative">
                <div className="w-full h-full absolute top-0 left-0 hover:bg-black/[.2] cursor-pointer duration-[.2s]" />
                <img
                  src={singleProperty.images?.[i]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="w-full h-1/2 flex gap-2">
            {[3, 4].map((i) => (
              <div key={i} className="w-1/2 h-full relative">
                <div className="w-full h-full absolute top-0 left-0 hover:bg-black/[.2] cursor-pointer duration-[.2s]" />
                <img
                  src={singleProperty.images?.[i]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="flex justify-between w-full px-2 items-end mb-4">
        <div className="w-[50%]">
          <h1 className="text-3xl font-semibold text-black">
            {singleProperty.title}
          </h1>
          <div className="flex justify-between items-center w-full my-6">
            <h1 className="text-2xl text-black">{singleProperty.location}</h1>
            <div className="h-full w-[20%] flex items-center justify-between">
              <h3 className="flex relative">
                <i className="ri-star-fill text-5xl text-[#b17f44]"></i>
                <p className="absolute text-xs font-bold text-zinc-200 top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {average}
                </p>
              </h3>
              <div className="h-[40px] bg-zinc-300 w-[1px]" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-black">
                  {singleProperty.totalReview}
                </h3>
                <p className="text-xs underline">Reviews</p>
              </div>
            </div>
          </div>

          <div>{singleProperty.description}</div>
         

          {/* Amenities */}
          <div className="amenities w-full mt-2">
            <h1 className="text-2xl text-black">What this place offers</h1>
            <div className="grid grid-cols-2 gap-4 p-4 text-md">
              {singleProperty.amenities.slice(0, 10).map((amenity, index) => (
                <h4 key={index} className="col-span-1 text-zinc-800">
                  ~ {amenity}
                </h4>
              ))}
              {singleProperty.amenities.length > 10 && (
                <button
                  className="text-center mt-4 text-zinc-800 border-zinc-800 border rounded-md py-3"
                  type="button"
                >
                  Show all {singleProperty.amenities.length} amenities
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-fit mb-4">
          <BookingCard nightRate={nightRate} totalPrice={singleProperty.price} property_id = {id}   />
        </div>
      </div>

      {/* Rating Metrics */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8">
        {ratings.map((rating) => (
          <div key={rating.label} className="text-center">
            <p className="text-xl font-semibold">{rating.value}</p>
            <div className="flex justify-center items-center mt-1">
              <i className={`${rating.icon} text-2xl`} />
            </div>
            <p className="text-gray-500 text-sm">{rating.label}</p>
          </div>
        ))}
      </div>

      {/* Add Review Form Section */}
      <div className="border-t border-b py-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
        <form onSubmit={handleSubmitReview} className="max-w-2xl">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-3xl focus:outline-none"
                >
                  <i className={`ri-star-${rating >= star ? 'fill' : 'line'} text-[#b17f44]`}></i>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700 mb-2">Your Review</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b17f44]"
              rows="4"
              placeholder="Share your experience with this property..."
              required
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#b17f44] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-200 disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-2 gap-4">
        {reviews.slice(0, 6).map((review, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-zinc-400 mr-3 flex items-center justify-center text-white font-bold text-lg">
                {review?.user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold">{review?.user?.username}</h3>
                <p className="text-sm text-gray-500">Verified guest</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              ⭐ {review?.ratings || "5.0"} — Reviewed recently
            </p>
            <p className="text-gray-700">{review?.comment}</p>
          </div>
        ))}

        {reviews.length > 6 && (
          <button
            className="mb-5 text-center text-zinc-800 font-bold border-zinc-800 border rounded-md py-3 w-fit px-10"
            type="button"
          >
            Show all {reviews.length} reviews
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SingleProperty;