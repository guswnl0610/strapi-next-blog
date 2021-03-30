module.exports = {
  definition: `
  `,
  query: `
  `,
  mutation: `
    registerWithMail(input: UsersPermissionsRegisterInput!):UsersPermissionsLoginPayload!
  `,
  type: {},
  resolver: {
    Query: {},
    Mutation: {
      registerWithMail: {
        description: "register and send welcome email",
        resolverOf: "application::user.user.signup",
        resolver: async (obj, options, { context }) => {
          // console.log("options>>>", options, "context>>>>>", context);
          return strapi.controllers.user.signup(context);

          // return strapi.plugins["users-permissions"].controllers.auth.register(
          //   context
          // );
        },
      },
    },
  },
};
