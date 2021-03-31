import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { MYINFO } from "lib/apollo/query";
import { userVar } from "lib/apollo/store";

function Nav() {
  const { data, error } = useQuery(MYINFO, { onCompleted: (data) => userVar(data?.myinfo) });
  console.log(data);

  return (
    <nav className="shadow-lg w-full py-3 px-6 text-2xl text-red-400 font-bold">
      <Link href="/home">
        <a>Title</a>
      </Link>
    </nav>
  );
}

export default Nav;
