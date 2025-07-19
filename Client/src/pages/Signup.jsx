import { useForm } from "react-hook-form";
import { signUpService } from "../API/userService";
import { toast } from "react-toastify";

const Signup = ({ display, setDisplay }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!display) return null;

  const onSubmit = async (data) => {
    const res = await signUpService(data);
    if (res) {
      toast.success("Signup Successful");
      setDisplay(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend's Google auth route
   window.location.href = "https://airbnb-yfw9.onrender.com/auth/google";
  };

  return (
    <div className="signupPage flex fixed z-[2] top-0 left-0 w-full bg-zinc-800/[.4] h-screen items-center justify-center">
      <div className="py-1 w-[35%] bg-zinc-50 rounded-xl">
        <div className="w-full py-4 relative border-b border-[#dfdfdf]">
          <div className="absolute left-[3%] top-1/2 -translate-y-1/2">
            <i
              onClick={() => setDisplay(false)}
              className="ri-close-large-line text-zinc-800 cursor-pointer"
            ></i>
          </div>
          <h1 className="text-center font-bold text-lg text-zinc-800">
            Sign Up
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
              <div className="w-full p-4 text-md relative flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Username:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                {errors.username && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="w-full p-4 text-md relative flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Phone:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="number"
                  {...register("phone", { required: "Mobile is required" })}
                />
                {errors.phone && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.phone.message}
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
              className="w-full text-center bg-[#b17f44] mt-4 text-white rounded-md py-3"
              type="submit"
            >
              Continue
            </button>
          </form>

          <div className="flex items-center gap-2 my-4 justify-center text-sm text-zinc-500">
            <div className="w-[30%] h-[1px] bg-zinc-300" />
            <span>OR</span>
            <div className="w-[30%] h-[1px] bg-zinc-300" />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center gap-3 bg-white border border-gray-300 py-2 px-4 rounded-md shadow-md hover:bg-gray-100 transition-all duration-200"
            >
              <img
              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
                 alt="Google Logo"
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-medium">
                Continue with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
