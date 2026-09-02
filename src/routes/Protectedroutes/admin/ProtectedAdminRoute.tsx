import { Navigate, Outlet } from "react-router-dom";
import { usegetme } from "../../../hooks/useUsers";

const AdminProtectedRoute = () => {
  const { data, isLoading, isError } = usegetme();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return <Navigate to="/login" replace />;
  }

  if (data.data.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;