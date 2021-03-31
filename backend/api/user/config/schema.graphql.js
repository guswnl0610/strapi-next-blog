module.exports = {
  definition: `
    type LogoutPayload {
      authorized: Boolean
      message: String
    }
  `,
  query: ``,
  mutation: `
    logout: LogoutPayload!
  `,
  resolver: {
    Query: {},
    Mutation: {
      logout: {
        resolverOf: "application::user.user.logout",
        resolver: async (obj, options, { context }) => {
          await strapi.controllers.user.logout(context);
          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;
          console.log(context.response);
          return {
            authorized: output.authorized,
            message: output.message,
          };
        },
      },
    },
  },
};
