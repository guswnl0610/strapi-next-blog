import { gql } from "@apollo/client";
import nookies from "nookies";

const checkLoggedIn = async (client, ctx) => {
  try {
    await client.query({
      query: gql`
        query {
          myInfo {
            id
            username
          }
        }
      `,
    });
  } catch (error) {
    nookies.destroy(ctx, "token");
    ctx.res.setHeader("Location", "/");
    ctx.res.statusCode = 303;
    ctx.res.end();
  }
};

export default checkLoggedIn;
