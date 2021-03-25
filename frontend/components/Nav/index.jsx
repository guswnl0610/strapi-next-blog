import React from "react";
import Link from "next/link";

function Nav() {
  return (
    <nav className="shadow-lg w-full p-6 text-4xl text-red-400 font-bold">
      <Link href="/">
        <a>아무튼 제목임~</a>
      </Link>
    </nav>
  );
}

export default Nav;
