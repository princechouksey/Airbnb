import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProperty } from "../../API/propertyService";

const Cards = () => {
  const [allProperty, setAllProperty] = useState([]);
  const [visibleProperties, setVisibleProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // ⬅️ Start with 4

  const getAllProperties = async () => {
    try {
      const response = await getAllProperty();
      const properties = response?.data?.data || [];
      setAllProperty(properties);
      setVisibleProperties(properties.slice(0, 4)); // Initial 4
    } catch (error) {
      console.error("Failed to load properties:", error);
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const handleShowMore = () => {
    const nextCount = visibleCount + 6;
    const newVisible = allProperty.slice(0, nextCount);
    setVisibleProperties(newVisible);
    setVisibleCount(nextCount);
  };

  return (
    <div className="w-full px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
        {visibleProperties.map((property, index) => (
          <Link
            to={`/property/get/${property._id}`}
            key={index}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-full h-52 relative">
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="w-full h-full flex items-center overflow-x-auto overflow-y-hidden no-scrollBar">
                  {property.images?.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt={property.location}
                      className="w-full object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-lg">{property.title}</h2>
              <p className="text-gray-500 text-sm">{property.location}</p>
              <p className="text-black font-bold mt-2">₹{property.price}</p>
              {property.rating && (
                <p className="text-yellow-500 text-sm mt-1">
                  ⭐ {property.rating.toFixed(2)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < allProperty.length && (
        <div className="explore-more w-full text-center my-12 space-y-2">
          <h2 className="font-bold text-lg text-zinc-900">
            Continue exploring farms
          </h2>
          <button
            onClick={handleShowMore}
            className="bg-[#111] text-[#fff] py-3 px-5 font-bold rounded-lg"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default Cards;
