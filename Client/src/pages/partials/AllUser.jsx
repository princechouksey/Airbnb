import  { useEffect, useState } from 'react'
import { DeleteUser, getAllUser } from "../../API/adminService";

const AllUser = () => {
  const [users, setUsers] = useState([])

  // Fetch users from the API
  const getUsers = async () => {
    try {
      const res = await getAllUser()
      setUsers(res.data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  const deleteUser =async (id)=>{
   
    const res = await DeleteUser(id)
    console.log(res)
    
  }





  return (
    <main className="flex-1 px-6 ">
      {/* Last Tasks */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-xl">
              <th>Username</th>
              <th>Email</th>
              <th>Member Since</th>
              <th>Number of Properties</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop over users array and display each user */}
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}> {/* Assuming 'id' is the unique identifier for each user */}
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                 <td>{new Date(user.createdAt).toISOString().split("T")[0]}</td>
                  <td>{user.properties.length}</td> {/* Assuming 'propertiesCount' is the number of properties */}
                  <td> 
                    <button onClick={()=>{deleteUser(user._id)}} className="w-full text-center bg-[#b17f44] text-white rounded-md py-2 mb-2 text-sm" type="submit">
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Productivity and Projects */}
      <section className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Productivity</h2>
          <div>
            {/* Placeholder for chart */}
            <div className="h-32 bg-gray-200 flex items-center justify-center">
              Chart Placeholder
            </div>
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
            {/* Add other projects */}
          </ul>
        </div>
      </section>
    </main>
  )
}

export default AllUser
