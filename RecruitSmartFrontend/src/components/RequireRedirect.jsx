import React from "react";
import { Navigate } from "react-router-dom";
import { useNavigation } from "./NavigationContext";

const RequireRedirect = ({ children }) => {
    const { canAccessDashboard } = useNavigation();

    return canAccessDashboard ? children : <Navigate to="/" />;
};

export default RequireRedirect;
