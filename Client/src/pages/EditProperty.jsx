import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { editSingleProperty, getSingleProperty } from "../API/propertyService";
import { useNavigate, useParams } from "react-router-dom";

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Use react-hook-form for managing form state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // useEffect hook to fetch property details when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property data by ID
        const res = await getSingleProperty(id);
        const property = res.data.data;
        console.log(property)

        // Convert images and amenities (arrays) to space-separated strings for the input fields
        const formattedData = {
          ...property,
          images: property.images.join(" "), // joining array to space-separated string for the 'images' field
          amenities: property.amenities.join(" "), // joining array to space-separated string for the 'amenities' field
        };
        console.log(formattedData)

        // Set the form fields with the fetched data
        reset(formattedData);
      } catch (err) {
        console.error("Error fetching property data:", err);
      }
    };

    // Call fetchData function
    fetchData();
  }, [id, reset]); // Fetch data when 'id' changes or when 'reset' changes

  // Form submission handler
  const onSubmit = async (data) => {
    // Convert space-separated strings back to arrays
    data.images = data.images.split(" ");
    data.amenities = data.amenities.split(" ");

    try {
      // Make API request to save the edited property
      const res = await editSingleProperty(data, id);
      console.log(res.data);
      
      // Navigate to the profile page after successful submission
      navigate("/profile");
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="loginPage flex z-[2] top-0 left-0 w-full bg-zinc-100 h-screen items-center justify-center">
      <div className="py-1 w-[35%] bg-zinc-50 rounded-xl shadow-xl">
        <div className="w-full py-4 relative">
          <div className="absolute left-[3%] top-1/2 -translate-y-1/2"></div>
          <h1 className="text-center font-bold text-lg text-zinc-800">Edit Property</h1>
        </div>

        <div className="py-5 px-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full border border-zinc-500 rounded-lg">
              {/* Title Input */}
              <div className="w-full p-4 text-md relative flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Title:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i> {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description Input */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Description:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="text"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i> {errors.description.message}
                  </p>
                )}
              </div>

              {/* Location Input */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Location:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="text"
                  {...register("location", { required: "Location is required" })}
                />
                {errors.location && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i> {errors.location.message}
                  </p>
                )}
              </div>

              {/* Price Input */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Price (INR per night):</label>
                <input
                  className="w-[65%] h-full focus:outline-none text-xl"
                  type="number"
                  {...register("price", { required: "Price is required" })}
                />
                {errors.price && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i> {errors.price.message}
                  </p>
                )}
              </div>

              {/* Amenities Input */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Amenities:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="text"
                  {...register("amenities", { required: "Amenities are required" })}
                />
                {errors.amenities && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i> {errors.amenities.message}
                  </p>
                )}
              </div>

              {/* Images Input */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3">
                <label>Images:</label>
                <input
                  className="w-full h-full focus:outline-none text-xl"
                  type="url"
                  {...register("images", {
                    required: "Images are required",
                    pattern: {
                      value: /(^\s*(https?:\/\/.*)\s*$)/i,
                      message: "Invalid image URL",
                    },
                  })}
                />
                {errors.images && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i> {errors.images.message}
                  </p>
                )}
              </div>
            </div>
            <button
              className="w-full text-center bg-[#b17f44] mt-4 text-white rounded-md py-3"
              type="submit"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
