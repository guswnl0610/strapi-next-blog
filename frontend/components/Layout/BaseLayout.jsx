import React from "react";
import Nav from "../Nav";

function BaseLayout({ children }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}

export default BaseLayout;
