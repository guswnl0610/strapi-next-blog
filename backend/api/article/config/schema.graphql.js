module.exports = {
  definition: `
  `,
  query: `
    singleArticle(id: ID!, publicationState: PublicationState): Article!
    articlesByUser: [Article]!
  `,
  mutation: `
    attatchArticleToUser(id: ID, userID: ID): Article!
  `,
  type: {},
  resolver: {
    Query: {
      singleArticle: {
        description: "return a single article",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::article.article.findOne",
        // resolverOf: "application::article.article.findOne",
        // resolver: async (obj, options, ctx) => {
        //   // console.log(ctx, obj, options);
        //   // const result = await strapi.services.article.findOne({
        //   //   id: options.id,
        //   // });
        //   return strapi.services.article.findOne({ id: options.id });
        // },
      },
      articlesByUser: {
        description: {
          description: "return articles by loginned User",
          resolverOf: "application::article.article.findOne",
          resolver: async (obj, options, ctx) => {
            const result = await strapi.services.article.findOne(options);

            console.log(result);

            return result;
          },
        },
      },
    },
    Mutation: {},
  },
};
