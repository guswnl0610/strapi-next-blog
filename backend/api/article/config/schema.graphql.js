module.exports = {
  definition: `
    
  `,
  query: `
    articlesByUser(sort: String, start: Int, limit: Int): [Article]!
    articleByUser(id: ID!): Article!
  `,
  mutation: `
    likeArticle(id: ID!): Article!
    dislikeArticle(id: ID!): Article!
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
      articleByUser: {
        description: "return a specific article by logined user",
        resolverOf: "application::article.article.getArticleByMe",
        resolver: async (obj, options, { context }) => {
          const article = await strapi.controllers.article.getArticleByMe(
            context
          );
          return article;
        },
      },
    },
    Mutation: {
      likeArticle: {
        description: "likes a specific article",
        resolverOf: "application::article.article.likeArticle",
        resolver: async (obj, options, { context }) => {
          const article = await strapi.controllers.article.likeArticle(context);
          return article;
        },
      },
      dislikeArticle: {
        description: "undo likes on a specific article",
        resolverOf: "application::article.article.dislikeArticle",
        resolver: async (obj, options, { context }) => {
          const article = await strapi.controllers.article.dislikeArticle(
            context
          );
          return article;
        },
      },
    },
  },
};
