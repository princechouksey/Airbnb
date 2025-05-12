import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPaymentService } from "../API/paymentService";

const BookingPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const [paymentDetails, setPaymentDetails] = useState({
    razorpayOrderId: "",
    razorpayPaymentId: "",
    razorpaySignature: "",
  });

  // Use URLSearchParams for cleaner parsing
  const queryParams = new URLSearchParams(search);
  const data = {
    order_id: queryParams.get("order_id"),
    price: Number(queryParams.get("price")),
    nights: Number(queryParams.get("nights")),
    checkin: queryParams.get("checkin"),
    checkout: queryParams.get("checkout"),
  };

  const amount = data.price * 100; // in paise for Razorpay

  // Function to verify payment with backend
  const verifyPaymentWithServer = async (paymentData) => {
    try {
      const res = verifyPaymentService(paymentData)
      if (res) {
        alert("Payment verified successfully");
        // Optionally navigate to success page
        navigate("/");
      } else {
        alert("Payment verification failed");
      }

     
    } catch (error) {
      console.error("Verification error:", error);
      alert("Payment verification failed");
    }
  };

  const handlePayment = async () => {
    const options = {
      key: "rzp_test_TD7hsHlT24JGFc", // Use env var in production
      amount: amount,
      currency: "INR",
      name: "TEST CORP",
      description: "Test transaction",
      order_id: data.order_id,
      handler: function (response) {
        alert(`Payment successful!
Payment ID: ${response.razorpay_payment_id}
Order ID: ${response.razorpay_order_id}
Signature: ${response.razorpay_signature}`);

        const paymentData = {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        };

        setPaymentDetails(paymentData);
        verifyPaymentWithServer(paymentData);
      },
      prefill: {
        name: "Devendra",
        email: "dev@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        upi: true,
        card: false,
        netbanking: false,
        wallet: false,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="h-screen w-full bg-zinc-50 px-40 flex flex-col justify-center items-center">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="col-span-2">
          <h1 className="text-2xl font-bold mb-6">Request to book</h1>

          {/* Trip Details */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-5">Your trip</h2>
            <div className="flex gap-20 items-center">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold text-black">Dates</p>
                  <p className="text-lg font-medium">
                    {new Date(data.checkin).getDate() +
                      " " +
                      new Date(data.checkin).toLocaleString("default", {
                        month: "short",
                      }) +
                      " " +
                      new Date(data.checkin).getFullYear()}{" "}
                    –{" "}
                    {new Date(data.checkout).getDate() +
                      " " +
                      new Date(data.checkout).toLocaleString("default", {
                        month: "short",
                      }) +
                      " " +
                      new Date(data.checkout).getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="bg-[#b17f44] text-white font-bold py-2 px-10 rounded-lg mt-8"
            >
              Book Now
            </button>
          </section>
        </div>

        {/* Right Section */}
        <div>
          <div className="border rounded-lg p-4">
            <div className="flex gap-4 mb-6">
              <img
                src="https://images.unsplash.com/photo-1605179206234-1a77c1f0c83a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Hotel"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">Royal Boutique Hotel - VILA DOMINA</p>
                <p className="text-sm text-gray-600">Room in boutique hotel</p>
              </div>
            </div>

            {/* Price Details */}
            <h2 className="text-lg font-semibold mb-4">Price details</h2>
            <div className="flex justify-between text-sm mb-2">
              <p>
                ₹{data.price} x {data.nights} nights
              </p>
              <p>₹{data.price * data.nights}</p>
            </div>
            <div className="flex justify-between font-semibold text-md mt-4 border-t pt-4">
              <p>Total (INR)</p>
              <p>₹{data.price * data.nights}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
