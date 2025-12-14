import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ children }) {
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);

  if (!token) return <Navigate to="/login" replace />;

  if (!user) return null; // or a loader while user is loading

  if (user.accountType === "INSTRUCTOR")
    return <Navigate to={`/i/${user._id}`} replace />;

  if (user.accountType === "STUDENT")
    return <Navigate to={`/s/${user._id}`} replace />;

  if (user.accountType === "ADMIN")
    return <Navigate to={`/a/${user._id}`} replace />;

  return <Navigate to="/login" replace />;
}
