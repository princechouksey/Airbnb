import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPasswordService } from "../../API/userService"; // adjust if needed

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPasswordService(token, { newPassword });
      alert(res.data.message || "Password reset successful!");
      navigate("/"); // Redirect to login page after successful reset
    } catch (err) {
      console.error("Reset error:", err);
      alert(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resetPage flex fixed z-[2] top-0 left-0 w-full bg-zinc-800/[.4] h-screen items-center justify-center">
      <div className="py-1 w-[35%] bg-zinc-50 rounded-xl">
        <div className="w-full py-4 relative border-b border-[#dfdfdf]">
          <h1 className="text-center font-bold text-lg text-zinc-800">
            Reset Password
          </h1>
        </div>

        <div className="py-5 px-5">
          <form onSubmit={handleReset}>
            <div className="w-full border border-zinc-500 rounded-lg">
              <div className="w-full p-4 text-md relative flex flex-col gap-2 border-b border-zinc-500">
                <label className="text-zinc-700">New Password:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="w-full p-4 text-md relative flex flex-col gap-2">
                <label className="text-zinc-700">Confirm Password:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              className="w-full text-center bg-[#b17f44] mt-4 text-white rounded-md py-3 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
