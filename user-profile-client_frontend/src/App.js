import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", bio: "" });
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
    try {
      await axios.post("http://localhost:7279/api/user", newUser);
      setNewUser({ username: "", email: "", bio: "" }); // Clear form
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
    setEditingUser({ ...user });
  };

  const handleEditInputChange = (e) => {
    // NEW FUNCTION for edit form
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:7279/api/user/${editingUser.id}`,
        editingUser
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
                  <div style={{ width: "300px", marginRight: "20px" }}>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={{ width: "300px", marginRight: "20px" }}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={{ width: "300px", marginRight: "20px" }}>
                    <input
                      tepe="text"
                      name="bio"
                      placeholder="Bio"
                      value={newUser.bio}
                      onChange={handleInputChange}
                    />
                  </div>
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
                    {" "}
                    {/* Container for flexbox */}
                    <div style={{ width: "300px", marginRight: "20px" }}>
                      {user.username}
                    </div>
                    <div style={{ width: "300px", marginRight: "20px" }}>
                      {user.email}
                    </div>
                    <div style={{ width: "300px", marginRight: "20px" }}>
                      {user.bio}
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
                        <div style={{ width: "300px", marginRight: "20px" }}>
                          <input
                            type="text"
                            style={{ width: "200px", marginRight: "20px" }}
                            name="username"
                            value={editingUser.username}
                            onChange={handleEditInputChange}
                            required
                          />
                        </div>
                        <div style={{ width: "300px", marginRight: "20px" }}>
                          <input
                            type="email"
                            style={{ width: "200px", marginRight: "20px" }}
                            name="email"
                            value={editingUser.email}
                            onChange={handleEditInputChange}
                            required
                          />
                        </div>

                        <div style={{ width: "300px", marginRight: "20px" }}>
                          <input
                            type="text"
                            name="bio"
                            style={{ width: "200px", marginRight: "20px" }}
                            value={editingUser.bio}
                            onChange={handleEditInputChange}
                          />
                        </div>

                        <button type="submit">Update</button>
                        <button onClick={() => setEditingUser(null)}>
                          Cancel
                        </button>
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
