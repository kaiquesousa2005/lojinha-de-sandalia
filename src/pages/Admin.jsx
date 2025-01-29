import React from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import AdminDashboard from "../components/AdminDashboard"
import "./Admin.css"

function Admin() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/")
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

  return (
    <div className="admin-page">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <AdminDashboard />
    </div>
  )
}

export default Admin

