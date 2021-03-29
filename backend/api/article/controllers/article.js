"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findByUser(ctx) {
    const user = await strapi.plugins["users-permissions"].services.user.fetch({
      id: ctx.state.user.id,
    });
    const entity = user.articles;

    return sanitizeEntity(entity, { model: strapi.models.article });
  },
};
