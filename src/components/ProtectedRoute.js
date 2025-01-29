import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    // Usuário não está autenticado, redireciona para a página de login
    return <Navigate to="/admin-login" replace />
  }

  return children
}

export default ProtectedRoute

