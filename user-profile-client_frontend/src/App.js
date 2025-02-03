import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", gender: "", birthDate: "" });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:7279/api/user"); // Your API URL
      
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();

    //Transform the birth date before sending to the backend
    const newUserToSend = { ...newUser };
    if (newUserToSend.birthDate) {
      newUserToSend.birthDate = `${newUserToSend.birthDate}T00:00:00Z`; // Add time and Z
    }
    
    try {
      await axios.post("http://localhost:7279/api/user", newUserToSend);
      setNewUser({ username: "", email: "", gender: "", birthDate: "" }); // Clear form
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:7279/api/user/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const startEditing = (user) => {
    const usersWithFormattedDates = { ...user,
      birthDate: user.birthDate ? user.birthDate.slice(0, 10) : "" // Handle null/undefined
    };
    
    setEditingUser({ ...usersWithFormattedDates });
    console.log(user);
  };

  const handleEditInputChange = (e) => {
    // NEW FUNCTION for edit form
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const updateUser = async (e) => {
    e.preventDefault();

    //Transform the birth date before sending to the backend
    const editingUserToSend = { ...editingUser };
    if (editingUserToSend.birthDate) {
      editingUserToSend.birthDate = `${editingUserToSend.birthDate}T00:00:00Z`
    }

    try {
      await axios.put(
        `http://localhost:7279/api/user/${editingUser.id}`,
        editingUserToSend
      );
      setEditingUser(null); // Close edit form
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="App">
      <h1>User Profiles</h1>

      {/* Create User Form */}
      <h2>Create New User</h2>
      <form onSubmit={createUser}>
        <table>
          <tbody>
            <tr>
              <td>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      style={{ marginRight: "10px"}}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      style={{ marginRight: "10px", width: "300px"}}
                      required
                    />
                    <select name="gender" value={newUser.gender} onChange={handleInputChange} style={{ marginRight: "10px"}}> {/* Gender dropdown */}
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="date" // Date input for birthdate
                      name="birthDate"
                      value={newUser.birthDate}
                      onChange={handleInputChange}
                      style={{ width: "100px", marginRight: "10px"}}
                      required
                    />
                  <button type="submit">Create</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {/* User List */}
      <h2>User List</h2>
      <table>
        <tbody>
          {users.map((user) => (
            <>
              <tr key={user.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ width: "200px", marginRight: "20px" }}>
                      {user.username} {/* Display user.name */}
                    </div>
                    <div style={{ width: "300px", marginRight: "20px" }}>
                      {user.email}
                    </div>
                    <div style={{ width: "100px", marginRight: "20px" }}> {/* Adjust width as needed */}
                      {user.gender}
                    </div>
                    <div style={{ width: "100px", marginRight: "20px" }}>
                        {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : "-"} {/* Format the date */}
                    </div>
                    <div style={{ width: "50px", marginRight: "20px" }}>
                        {user.age} {/* Display the age */}
                    </div>
                    <button onClick={() => startEditing(user)}>Edit</button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </div>
                </td>
              </tr>
              {/* Edit Form (Conditional Rendering) */}
              {editingUser && editingUser.id === user.id && (
                <tr>
                  <td>
                    <form onSubmit={updateUser}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input type="text" name="username" value={editingUser.username} onChange={handleEditInputChange} required style={{ marginRight: "10px" }} />
                        <input type="email" name="email" value={editingUser.email} onChange={handleEditInputChange} required style={{ marginRight: "10px", width: "300px" }} />
                        <select name="gender" value={editingUser.gender} onChange={handleEditInputChange} style={{ marginRight: "10px" }}>
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <input type="date" name="birthDate" value={editingUser.birthDate} onChange={handleEditInputChange} required style={{ width: "100px", marginRight: "10px" }} />
                        <button type="submit" style={{ marginRight: "10px" }}>Update</button>
                        <button onClick={() => setEditingUser(null)} style={{ marginRight: "10px"}}>Cancel</button>
                      </div>
                    </form>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
