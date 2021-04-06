import { useQuery, gql } from "@apollo/client";
import { useEffect } from "react";
import { userVar } from "lib/apollo/store";
import { useRouter } from "next/router";

export const MYINFO = gql`
  query {
    myInfo {
      id
      username
      email
      profile_image {
        id
        url
      }
    }
  }
`;

export const useAuth = () => {
  const { data } = useQuery(MYINFO);

  useEffect(() => {
    if (data) {
      userVar(data.myInfo);
      return;
    }
  }, [data]);
};
