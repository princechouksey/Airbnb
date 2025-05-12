import { useEffect } from "react";
import Cards from "./partials/Cards";
import Footer from "./partials/Footer";
import Nav from "./partials/Nav";
import { currentUserService } from "../API/userService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { currentuser } from "../store/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  console.log(user);

  const fetchCurrentUser = async () => {
    const res = await currentUserService();
    console.log(res);
    if (res) {
      dispatch(currentuser(res.data)); // This now refers to the Redux action creator
      toast.success(res.data.message);
    }
  };

  useEffect(() => {
    fetchCurrentUser(); // Call the renamed function here
  }, []);

  return (
    <div className="bg-zinc-50 pt-24 relative w-full h-full">
      <h1 className="text-center mt-10 text-[4.5vw]">
        Experience the <span className="text-[#b17f44]">Aura</span> <br /> of
        Elegance.
      </h1>
      <Cards />

      <Footer />
    </div>
  );
};

export default Home;
