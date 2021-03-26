module.exports = {
  definition: `
  `,
  query: `
    articlesByUser: [Article]!
  `,
  mutation: `
    attatchArticleToUser(id: ID, userID: ID): Article!
  `,
  type: {},
  resolver: {
    Query: {
      article: {
        description: "return a single article",
        policies: ["plugins::users-permissions.isAuthenticated"],
      },
    },
    Mutation: {},
  },
};
