import React, { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [canAccessDashboard, setCanAccessDashboard] = useState(false);

    return (
        <NavigationContext.Provider value={{ canAccessDashboard, setCanAccessDashboard }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => useContext(NavigationContext);
