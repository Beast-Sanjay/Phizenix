import React , {useEffect, useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function HomePage() {
    const [users, setUsers] = useState([]);
    const currUsername = localStorage.getItem("username");
    const navigate = useNavigate();
    

  useEffect(() => {
    const fetchUsers = () => {
      axios.get('http://192.168.0.100:5000/api/user/')
      .then(
        res => {
          if (res.status === 200 && res.data){
              setUsers(res.data)
          }
        }
      ).catch(err => {alert("Error fetching users");setUsers([])})
    };

    fetchUsers()
  },[setUsers])
  

  const updatePassword = (user_id) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    axios.put(`http://192.168.0.100:5000/api/user/${user_id}`, {newPassword} ).then(
      res => {
        if(res.data.result === "success"){
           alert("Password Updated")
          //  fetchUsers()
        }
      }
    ).catch(err => alert("Failed to reset pass....!"))
  }

  const deleteUser = (user_id) => {
    console.log(user_id)
    axios.delete(`http://192.168.0.100:5000/api/user/${user_id}`).then(
      res => {
        if(res.data.result === "success"){
           alert("User deleted successfully.")
        }
      }
    ).catch(err => alert("Failed to reset pass....!"))
  }

     
  const onLogout = () => {
    localStorage.removeItem("username");
    navigate("/auth"); 
    window.location.reload();
};


  return (
    <div className="container">

      <div className="mt-4">
        <div className="user-container">
          <h1>Welcome User: {currUsername}</h1>

          {currUsername && (
            <button className="btn btn-primary logout-btn" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
    
{/*     
        <button className="btn btn-primary mb-3 ms-2" onClick={fetchUsers}>
          Get all users
        </button> */}
    
        <table className="table table-striped">
          <thead>
            <tr>
              <th>SI.NO</th>
              <th>Username</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => updatePassword(user.user_id)}
                    >
                      Update Password
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteUser(user.user_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center mt-3">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  
      
  )
}

export default HomePage
