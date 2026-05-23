import { Navigate } from "react-router-dom"
import useAuth from "./useAuth"

function ProtectedRoute({ allowedRole, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <h1>Loading...</h1>
  }

  // not logged in
  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  // wrong role
  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute