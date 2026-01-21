import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, requireCompanyActive = false, requireRole }) {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    // Not logged in
    if (!user) return <Navigate to="/authenticate" replace />;

    // Company must be active
    if (requireCompanyActive && !user.companyActive) {
        return <Navigate to="/not-approved" replace />;
    }

    // Role check (if requireRole is provided)
    if (requireRole && !user.role === requireRole) {
        return <Navigate to="/" replace />; // or a "Not Authorized" page
    }

    // All checks passed → render the page
    return children;
}
