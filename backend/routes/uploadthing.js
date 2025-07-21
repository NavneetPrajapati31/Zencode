import { createRouteHandler } from "uploadthing/express";
import { ourFileRouter } from "../core.js";

export const uploadRouter = createRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});
