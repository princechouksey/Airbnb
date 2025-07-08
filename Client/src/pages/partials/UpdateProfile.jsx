import { useState } from "react";
import { useSelector } from "react-redux";
import { updateUserProfile } from "../../API/userService";
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const user = useSelector((state) => state.users?.user?.user);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    newPassword: "", // optional
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateUserProfile(formData);
      toast.success(res.data.message || "Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Username"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          placeholder="Phone"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          placeholder="Address"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          placeholder="New Password (optional)"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
