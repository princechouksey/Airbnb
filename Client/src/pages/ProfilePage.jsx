import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteSingleProperty, getAllProperty } from "../API/propertyService";
import { AllBooking, cancelBooking } from "../API/bookingService";
import { logoutService } from "../API/userService.js";
import { useDispatch } from "react-redux";
import { logout} from "../../src/store/userSlice.js"


const ProfilePage = () => {
  const [allProperty, setAllProperty] = useState([]);
  const [allBooking, setAllBooking] = useState([]);
  const dispatch = useDispatch();

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

  const booking = allBooking.filter((book) =>
    userBookings.includes(book._id)
  );

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
   const logoutHandler =async ()=>{
      try {
         const res = await logoutService();
         console.log(res)
         dispatch(logout())
         
      } catch (error) {
        console.error("Logout failed", error);
      }
  
    }
   

  return (
    <div className="h-full w-full pt-28 px-10 md:px-20 bg-zinc-50">
      <div className="flex h-full relative w-full gap-8 flex-col lg:flex-row">
        {/* Sidebar */}
       <div className="lg:w-[25vw] p-6 py-10 sticky top-[16vh] bg-white rounded-3xl h-fit shadow-[0px_0px_30px_2px_#e4e4e7] space-y-4">
  <div className="flex flex-col items-center text-center">
    <div className="flex items-center justify-center w-24 h-24 bg-black text-white text-5xl font-bold rounded-full">
      {user?.username?.[0]?.toUpperCase() || "U"}
    </div>
    <h2 className="text-2xl mt-3 font-semibold text-zinc-800">
      {user?.username || "Unnamed User"}
    </h2>
    {user?.email && (
      <p className="text-gray-500 text-sm">{user.email}</p>
    )}
  </div>

  <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
    <p>
      <span className="font-semibold text-black">Listings:</span>{" "}
      {user?.properties?.length || 0}
    </p>
    <p>
      <span className="font-semibold text-black">Bookings:</span>{" "}
      {user?.bookings?.length || 0}
    </p>
    <p>
      <span className="font-semibold text-black">Joined:</span>{" "}
      {new Date(user?.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </p>
  </div>

  <div className="pt-4 space-y-2">
    <Link
  to="/update-profile"
  className="w-full block text-center py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
>
  Edit Profile
</Link>

    <h3
      className="w-full py-2 text-center border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
      onClick={()=>{logoutHandler()}}
    >
      Logout
    </h3>
  </div>
</div>


        {/* Content */}
        <div className="w-full pt-2">
          {/* Properties */}
          <h1 className="text-3xl font-bold mb-6">My Properties</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {userProperties.map((prop) => (
              <div
                key={prop._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <Link to={`/property/get/${prop._id}`}>
                  <div className="h-50 w-full overflow-hidden">
                    <img
                      src={prop.images?.[0] || "https://via.placeholder.com/400"}
                      alt={prop.location}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                      {prop.title || "Untitled Property"}
                    </h2>
                    <p className="text-gray-600 text-sm">{prop.location}</p>
                    <p className="text-lg font-bold text-black mt-1">
                      ₹{prop.price}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-between px-4 pb-4 gap-2">
                  <Link
                    to={`/property/edit/${prop._id}`}
                    className="w-full text-center py-2 px-4 border border-[#b17f44] text-[#b17f44] font-semibold rounded-md hover:bg-[#b17f44] hover:text-white transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteHandler(prop._id)}
                    className="w-full text-center py-2 px-4 border border-red-500 text-red-500 font-semibold rounded-md hover:bg-red-500 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <h1 className="text-3xl font-bold mt-12 mb-6">My Bookings</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {booking.length > 0 ? (
    booking.map((book) => (
      <div
        key={book._id}
        className="bg-white border p-6 rounded-xl shadow-md"
      >
        <h2 className="text-xl font-semibold mb-2">Booking Info</h2>
        <p className="text-sm text-gray-700">
          <strong>Check-In:</strong>{" "}
          {new Date(book.checkin_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Check-Out:</strong>{" "}
          {new Date(book.checkout_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Total:</strong> ₹{book.totalPrice}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Status:</strong> {book.status}
        </p>
        {book.status !== "Cancelled" && (
          <button
            onClick={() => bookingCancelHandler(book._id)}
            className="mt-4 w-full py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all"
          >
            Cancel Booking
          </button>
        )}
      </div>
    ))
  ) : (
    <div className="col-span-full text-center text-gray-600 text-lg mt-4">
      💤 No bookings yet.
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
