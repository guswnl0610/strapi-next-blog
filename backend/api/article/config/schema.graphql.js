module.exports = {
  definition: `
    
  `,
  query: `
    articlesByUser: [Article]!
  `,
  mutation: `
  `,
  type: {},
  resolver: {
    Query: {
      articlesByUser: {
        description: "return articles by logined user",
        resolverOf: "application::article.article.find",
        resolver: async (obj, options, { context }) => {
          const tmp = await strapi.controllers.article.findByUser(context);
          return tmp;
        },
      },
    },
    Mutation: {},
  },
};
