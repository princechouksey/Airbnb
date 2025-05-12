import React, { useEffect, useState } from "react";
import { AllBooking } from "../../API/bookingService";

const AllBookings = () => {
  const [allBooking, setAllBooking] = useState([]);

  const getAllBookings = async () => {
    try {
      const res = await AllBooking();
      setAllBooking(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return (
    <main className="flex-1 px-6">
      <section className="bg-white p-6 rounded-lg shadow-md min-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Bookings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBooking.map((booking) => (
            <div
              key={booking._id}
              className="py-5 px-6 rounded-xl shadow-[0px_0px_30px_2px_#e4e4e7] bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-md font-bold">Place</h1>
                <h1 className="text-sm font-light truncate max-w-[60%] text-right">
                  {booking?.property?.title || "N/A"}
                </h1>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h1 className="text-md font-bold">Booked by</h1>
                <h1 className="text-sm font-light truncate max-w-[60%] text-right">
                  {booking?.user?.username || "N/A"}
                </h1>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-bold">Price</h3>
                <h3 className="text-sm font-light">₹{booking.totalPrice}</h3>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-bold">Status</h3>
                <h3
                  className={`text-sm font-bold ${
                    booking.status.toLowerCase() === "confirmed"
                      ? "text-green-600"
                      : booking.status.toLowerCase() === "pending"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {booking.status}
                </h3>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-bold">Order ID</h3>
                <h3 className="text-sm font-light truncate max-w-[60%] text-right">
                  {booking.razorpayOrderId}
                </h3>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col">
                  <h3 className="text-md font-bold">Check In</h3>
                  <h3 className="text-sm font-light">
                    {new Date(booking.checkin_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>
                </div>

                <div className="flex flex-col items-end">
                  <h3 className="text-md font-bold">Check Out</h3>
                  <h3 className="text-sm font-light">
                    {new Date(booking.checkout_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AllBookings;
