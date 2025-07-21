import { createUploadthing } from "uploadthing/express";
import { authenticateJWT } from "./middleware/auth.js";
import dotenv from "dotenv";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import jwt from "jsonwebtoken";

dotenv.config();

const f = createUploadthing();

const handleAuth = (req, res, next) => {
  try {
    authenticateJWT(req, res, () => {
      if (!req.user) {
        throw new Error("User not authenticated");
      }
      next();
    });
  } catch (error) {
    throw new Error("Authentication error");
  }
};

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({ image: { maxFileSize: "8MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Log all incoming headers for debugging
      console.log("[UploadThing] Middleware Headers:", req.headers);

      // Manually extract JWT from Authorization header
      const authHeader =
        req.headers["authorization"] || req.headers["Authorization"];
      if (!authHeader) {
        console.error("[UploadThing] No 'authorization' header found.");
        throw new Error("No auth header");
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        console.error("[UploadThing] No token found in auth header.");
        throw new Error("No token");
      }
      let user;
      try {
        console.log("[JWT VERIFY] JWT_SECRET in use:", process.env.JWT_SECRET);
        console.log("[JWT VERIFY] Token being verified:", token);
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (e) {
        console.error("[UploadThing] JWT verification failed:", e.message);
        console.error("[UploadThing] Token that failed:", token);
        throw new Error("Invalid token");
      }
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

export const UploadButton = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();
