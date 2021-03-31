"use strict";

const _ = require("lodash");

/**
 * Throws an ApolloError if context body contains a bad request
 * @param contextBody - body of the context object given to the resolver
 * @throws ApolloError if the body is a bad request
 */
function checkBadRequest(contextBody) {
  if (_.get(contextBody, "statusCode", 200) !== 200) {
    const message = _.get(contextBody, "error", "Bad Request");
    const exception = new Error(message);
    exception.code = _.get(contextBody, "statusCode", 400);
    exception.data = contextBody;
    throw exception;
  }
}

module.exports = {
  definition: `
    type UserPermissionsLoginPayloadWithToken {
      status: String
      user: UsersPermissionsMe!
    }
  `,
  query: `
  `,
  mutation: `
    registerWithMail(input: UsersPermissionsRegisterInput!):UserPermissionsLoginPayloadWithToken!
    loginWithToken(input: UsersPermissionsLoginInput!):UserPermissionsLoginPayloadWithToken!
  `,
  type: {},
  resolver: {
    Query: {},
    Mutation: {
      registerWithMail: {
        description:
          "Register a user and send welcome mail, set JWT in cookies",
        resolverOf: "plugins::users-permissions.auth.register",
        resolver: async (obj, options, { context }) => {
          context.request.body = _.toPlainObject(options.input);

          await strapi.plugins["users-permissions"].controllers.auth.register(
            context
          );
          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;

          checkBadRequest(output);
          return {
            user: output.user || output,
            status: output.status,
          };
        },
      },
      loginWithToken: {
        description: "Login and set JWT in cookies",
        resolverOf: "plugins::users-permissions.auth.callback",
        resolver: async (obj, options, { context }) => {
          context.params = {
            ...context.params,
            provider: options.input.provider,
          };
          context.request.body = _.toPlainObject(options.input);

          await strapi.plugins["users-permissions"].controllers.auth.callback(
            context
          );
          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;

          checkBadRequest(output);
          return {
            user: output.user || output,
            status: output.status,
          };
        },
      },
    },
  },
};
