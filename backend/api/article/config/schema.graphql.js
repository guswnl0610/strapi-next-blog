module.exports = {
  definition: `
    
  `,
  query: `
    articlesByUser(sort: String, start: Int, limit: Int): [Article]!
  `,
  mutation: `
  `,
  type: {},
  resolver: {
    Query: {
      articlesByUser: {
        description: "return articles by logined user",
        resolverOf: "application::article.article.findByUser",
        resolver: async (obj, options, { context }) => {
          const articles = await strapi.controllers.article.findByUser(context);
          return articles;
        },
      },
    },
    Mutation: {},
  },
};
