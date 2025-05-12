import React, { useEffect, useState } from "react";
import { deletePayment, getPayments } from "../../API/paymentService.js";

const AllPayment = () => {
  const [paymentData, setPaymentData] = useState([]);

  const fetchData = async () => {
    const res = await getPayments();
    setPaymentData(res?.data?.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <main className="flex-1 px-6">
      <section className="bg-white p-6 rounded-lg shadow-md min-h-[80vh]">
        <h2 className="text-xl font-bold mb-6">Payments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentData.map((payment) => (
            <div
              key={payment.booking}
              className="py-5 px-6 rounded-xl shadow-[0px_0px_30px_2px_#e4e4e7] bg-white overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-md font-bold">Property</h1>
                <div className="text-sm font-light max-w-[150px] truncate text-right">
                  {payment.property?.title || "N/A"}
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h1 className="text-md font-bold">Booked by</h1>
                <div className="text-sm font-light text-right truncate max-w-[150px]">
                  {payment.user?.username || "Unknown"}
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-bold">Price</h3>
                <h3 className="text-sm font-light text-right">₹{payment.amount}</h3>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-bold">Order ID</h3>
                <div className="text-sm font-light text-right break-words max-w-[150px]">
                  {payment.razorpayOrderId}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <h3 className="text-md font-bold">Payment Status</h3>
                <h3
                  className={`text-md font-bold ${
                    payment.status?.toLowerCase() === "success"
                      ? "text-green-600"
                      : payment.status?.toLowerCase() === "pending"
                      ? "text-orange-600"
                      : "text-gray-600"
                  }`}
                >
                  {payment.status}
                </h3>
              </div>

              <button
                onClick={() => deletePayment(payment?._id)}
                className="cursor-pointer text-center border-[#b17f44] text-[#b17f44] border rounded-md mt-4 py-2 w-full hover:bg-[#b17f44]/10 transition"
                type="button"
              >
                Delete Payment
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AllPayment;
