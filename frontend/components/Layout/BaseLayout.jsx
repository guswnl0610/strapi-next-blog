import React from "react";
import Nav from "../Nav";
import { useReactiveVar } from "@apollo/client";

function BaseLayout({ children }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}

export default BaseLayout;
