"use strict";

module.exports = {
  async logout(ctx) {
    console.log("context:", ctx);
    ctx.cookies.set("token", null);
    ctx.send({
      authorized: true,
      message: "Successfully destroyed session",
    });
  },
};
