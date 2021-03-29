import React from "react";
import Link from "next/link";

function Nav() {
  return (
    <nav className="shadow-lg w-full py-3 px-6 text-2xl text-red-400 font-bold">
      <Link href="/home">
        <a>아무튼 제목임~</a>
      </Link>
    </nav>
  );
}

export default Nav;
