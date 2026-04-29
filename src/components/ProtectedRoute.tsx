import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        {/* Simple loading spinner */}
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If there is no user logged in, send them automatically to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, load the requested page
  return <>{children}</>;
};

export default ProtectedRoute;
