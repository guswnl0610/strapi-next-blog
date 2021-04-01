import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { MYINFO } from "lib/apollo/query";
import { userVar } from "lib/apollo/store";
import { useRouter } from "next/router";

export const useAuth = () => {
  const { data } = useQuery(MYINFO);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      console.log("user");
      userVar(data.myInfo);
      return;
    }
    console.log("no user");
    userVar(null);
    router.push("/");
  }, []);
};
