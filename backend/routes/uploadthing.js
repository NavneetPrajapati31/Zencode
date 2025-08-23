const { createRouteHandler } = require("uploadthing/express");
const { ourFileRouter } = require("../core.js");

const uploadRouter = createRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
    uploadthingToken: process.env.UPLOADTHING_TOKEN,
  },
});

module.exports = { uploadRouter };
