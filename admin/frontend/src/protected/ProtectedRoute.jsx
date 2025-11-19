// src/protected/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";

/*
  ProtectedRoute: nếu chưa login -> render Login
  Nếu đã login -> render children (AdminLayout)
*/
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Login />;

  return children;
}
