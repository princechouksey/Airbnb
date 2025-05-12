import React, { useEffect, useState } from "react";
import { deleteSingleProperty, getAllProperty } from "../../API/propertyService";
import {  useNavigate } from "react-router-dom";

const Allproperties = () => { 
  const [properties, setProperties] = useState([])
  const navigate = useNavigate()

  const fetchProperties = async () => {
    try {
      const res = await getAllProperty();
      setProperties(res.data.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);
  console.log(properties[0])

  return (
    <main className="flex-1 px-6">
      {/* Properties Table */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Properties</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-xl">
              <th>Title</th>
              <th>Price</th>
              <th>Existing Since</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.length > 0 ? (
              properties.map((property) => (
                <tr key={property._id} className="border-t">
                  <td>{property.title}</td>
                  <td>₹{property.price}</td>
                  <td>12 may 2024</td>
                  <td>{property.location}</td>
                  <td className="flex gap-4">
                    <button onClick={()=>{
                     
                      navigate(`/property/get/${property._id}`)
                    }}
                      className="text-center border border-[#b17f44] text-[#b17f44] rounded-md py-2 px-4 text-sm"
                      type="button"
                    >
                      View
                    </button>
                    <button onClick={()=>{
                      deleteSingleProperty(property._id)
                    }}
                      className="text-center bg-[#b17f44] text-white rounded-md py-2 px-4 text-sm"
                      type="button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">No properties found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Placeholder Sections */}
      <section className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Productivity</h2>
          <div className="h-32 bg-gray-200 flex items-center justify-center">
            Chart Placeholder
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Projects in Progress</h2>
          <ul>
            <li className="mb-2">
              <p className="text-sm text-gray-600">Improve card readability</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>12 comments</span>
                <span className="ml-4">7 files</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Allproperties;
