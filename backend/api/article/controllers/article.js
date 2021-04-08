"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findByUser(ctx) {
    const entity = await strapi.services.article.find({
      "user.id": ctx.state.user.id,
      ...ctx.query,
    });

    return sanitizeEntity(entity, { model: strapi.models.article });
  },

  async getArticleByMe(ctx) {
    const { user } = ctx.state;
    const entity = await strapi.services.article.findOne({ ...ctx.query });
    if (entity.user.id !== user.id)
      return ctx.forbidden(null, [
        { messages: [{ id: "current user is not allowed" }] },
      ]);

    return sanitizeEntity(entity, { model: strapi.models.article });
  },
};
