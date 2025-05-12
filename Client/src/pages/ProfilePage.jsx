import React, { useEffect, useState } from "react";
import Cards from "./partials/Cards";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteSingleProperty, getAllProperty } from "../API/propertyService";
import { AllBooking, cancelBooking } from "../API/bookingService";

const ProfilePage = () => {
  const [allProperty, setAllProperty] = useState([]);
  const [allBooking, setAllBooking] = useState([]);

  const user = useSelector((state) => state.users?.user?.user);
  const userPropertyIds = user?.properties || [];
  const userBookings = user?.bookings || [];

  const getAllProperties = async () => {
    try {
      const response = await getAllProperty();
      setAllProperty(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    }
  };

  const getAllBookings = async () => {
    try {
      const res = await AllBooking();
      setAllBooking(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  useEffect(() => {
    getAllProperties();
    getAllBookings();
  }, []);

  const userProperties = allProperty.filter((property) =>
    userPropertyIds.includes(property._id)
  );

  const booking = allBooking.filter((book) => userBookings.includes(book._id));

  const deleteHandler = async (id) => {
    try {
      const res = await deleteSingleProperty(id);
      console.log(res);
      getAllProperties();
    } catch (error) {
      console.error("Failed to delete property", error);
    }
  };

  const bookingCancelHandler = async (id) => {
    try {
      const res = await cancelBooking(id);
      console.log(res);
      getAllBookings();
    } catch (error) {
      console.error("Failed to cancel booking", error);
    }
  };

  return (
    <div className="h-full w-full pt-28 px-20 bg-zinc-50">
      <div className="flex h-full relative w-full gap-8">
        <div className="w-[30vw] p-6 py-10 sticky top-[16vh] bg-white rounded-3xl h-fit shadow-[0px_0px_30px_2px_#e4e4e7] flex justify-between items-center">
          <div>
            <div className="flex items-center justify-center w-24 h-24 bg-black text-white text-5xl font-bold rounded-full mx-auto">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-center mt-4">
              <h2 className="text-4xl text-black font-semibold">
                {user?.username || "Unnamed User"}
              </h2>
            </div>
          </div>
        </div>

        <div className="w-full pt-2">
          <h1 className="text-3xl font-bold mb-4">My properties</h1>
          <div className="grid grid-cols-4 gap-6">
            {userProperties.map((prop) => (
              <div
                key={prop._id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <Link to={`/property/get/${prop._id}`}>
                  <div className="w-full h-40 relative">
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="w-full h-full flex items-center overflow-x-auto overflow-y-hidden no-scrollBar">
                        {prop.images &&
                          prop.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={prop.location}
                              className="w-full object-cover"
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold text-lg">{prop.location}</h2>
                    <p className="text-black font-bold">{prop.price}</p>
                  </div>
                </Link>
                <div className="flex gap-2 px-4 pb-4">
                  <Link
                    to={`/property/edit/${prop._id}`}
                    className="cursor-pointer text-center border border-[#b17f44] text-[#b17f44] rounded-md px-4 py-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteHandler(prop._id)}
                    className="cursor-pointer text-center border border-red-500 text-red-500 rounded-md px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold mt-10 mb-4">My bookings</h1>
          <div className="grid grid-cols-2 gap-6">
            {booking.map((book) => (
              <div
                key={book._id}
                className="border p-4 rounded-md bg-white shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {book.property.title}
                </h2>
                <p>
                  <strong>Check-In:</strong>{" "}
                  {new Date(book.checkin_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                <p>
                  <strong>Check-Out:</strong>{" "}
                  {new Date(book.checkout_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                <p>
                  <strong>Total:</strong> ₹{book.totalPrice}
                </p>
                <p>
                  <strong>Status:</strong> {book.status}
                </p>
                {book.status !== "Cancelled" && (
                  <button
                    onClick={() => bookingCancelHandler(book._id)}
                    className="mt-2 px-4 py-2 border border-red-500 text-red-500 rounded-md"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
