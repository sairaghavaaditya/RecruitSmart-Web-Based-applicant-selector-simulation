import React from "react";
import Header from "./Header"; // Adjust the path to the Header component

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
