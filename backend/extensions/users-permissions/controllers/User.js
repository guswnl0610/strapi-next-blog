const _ = require("lodash");
const { sanitizeEntity } = require("strapi-utils");

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });

module.exports = {
  async myInfo(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    const data = await strapi.plugins["users-permissions"].services.user.fetch({
      id: user.id,
    });

    ctx.body = sanitizeUser(data);
  },
};
