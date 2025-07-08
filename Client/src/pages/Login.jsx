import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginService,forgotPasswordService} from "../API/userService";
import { currentuser,  } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = ({ display, setDisplay }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  if (!display) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginService(data);
      if (res) {
        dispatch(currentuser(res.data));
        navigate('/');
        setDisplay(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    
    console.log(email);
    setLoading(true);
    try {
       const res = await forgotPasswordService({ email });
      if (res) {
        alert("Password reset link sent to your email.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      alert(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage flex fixed z-[2] top-0 left-0 w-full bg-zinc-800/[.4] h-screen items-center justify-center">
      <div className="py-1 w-[35%] bg-zinc-50 rounded-xl">
        <div className="w-full py-4 relative border-b border-[#dfdfdf]">
          <div className="absolute left-[3%] top-1/2 -translate-y-1/2">
            <i
              onClick={() => setDisplay(false)}
              className="ri-close-large-line text-zinc-800 cursor-pointer"
            ></i>
          </div>
          <h1 className="text-center font-bold text-lg text-zinc-800">
            Log In
          </h1>
        </div>

        <div className="py-5 px-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full border border-zinc-500 rounded-lg">
              <div className="w-full p-4 text-md relative flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Email:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3">
                <label>Password:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <button
              className="w-full text-center bg-[#b17f44] mt-4 text-white rounded-md py-3 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              className="w-full text-center mt-2 text-[#b17f44] underline"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {loading ? "Sending link..." : "Forgot Password?"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
