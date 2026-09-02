import { Navigate, Outlet } from "react-router-dom";
import { usegetme } from "../../../hooks/useUsers";

const ProtectedRoute = () => {
  const { data, isLoading } = usegetme();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const user=data?.data

  if (!data) {
    return <Navigate to="/login" replace />;
  }
  if(user.role == "AGENT" && user.verificationStatus !== "APPROVED") {
    return <Navigate to="/agent/verify" replace />;
  }




  return <Outlet />;
};

export default ProtectedRoute;
