import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {createBookingService} from "../../API/bookingService.js"

const BookingCard = ({nightRate, totalPrice, property_id}) => {
  //  console.log(property_id)
  const [checkin_date, setcheckin_date] = useState(new Date().toISOString().split('T')[0]); // Current date as checkin date
  const [checkout_date, setcheckout_date] = useState(new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0]); // 2 days ahead as checkout date
  const [nights, setNights] = useState(5); // Calculate nights based on checkin and checkout dates
  const [order_id, setorder_id] = useState("")
  const navigate = useNavigate()
   
  useEffect(() => {
      const checkin = new Date(checkin_date);
      const checkout = new Date(checkout_date);
      const difference = checkout.getTime() - checkin.getTime();
      const totalDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
      setNights(totalDays);
      if(checkin_date === checkout_date) {
        setNights(1);
      }
  }, [checkin_date, checkout_date]);

  const handleBooking = async () => {
    const res = await createBookingService({
      property_id,
      checkin_date,
      checkout_date,
      totalPrice,
    });
    const orderId = res.data.data.razorpayOrderId;

    navigate(
      `/booking/1?checkin=${checkin_date}&checkout=${checkout_date}&nights=${nights}&price=${totalPrice}&order_id=${orderId}`
    );
    
     
  };


  const totalBeforeTaxes = totalPrice * nights  // Multiply by guests for dynamic pricing

  return (
    <div className="border p-6 max-w-sm mx-auto shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">₹{totalPrice.toLocaleString()} <span className="text-sm">night</span></h2>

      <div className="border rounded-md mb-4">
        <div className="flex justify-between p-2 border-b">
          <div>
            <p className="text-sm font-semibold">Check-in</p>
            <input type="date" className="text-gray-500" value={checkin_date} onChange={(e) => setcheckin_date(e.target.value)} />
          </div>
          <div>
            <p className="text-sm font-semibold">Checkout</p>
            <input type="date" className="text-gray-500" value={checkout_date} onChange={(e) => setcheckout_date(e.target.value)} />
          </div>
        </div>
        
      </div>
      {/* <Link to={`/booking/1?checkin=${checkin_date}&checkout=${checkout_date}&orderId=${order_id}
&nights=${nights}&price=${totalPrice}`}>
      </Link> */}
      <button onClick={handleBooking} className="bg-[#b17f44] text-white font-bold py-2 px-4 w-full rounded-lg mb-4">
        Reserve
      </button>
      <p className="text-sm text-gray-500 text-center mb-4">You won't be charged yet</p>

      <div className="text-sm">
        <div className="flex justify-between mb-2">
          <span>₹{totalPrice.toLocaleString()} x {nights} nights </span>
          <span>₹{(totalPrice * nights ).toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total before taxes</span>
          <span>₹{totalBeforeTaxes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
