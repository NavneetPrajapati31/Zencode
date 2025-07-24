import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";

// Use env variable for backend API URL, fallback to relative for dev
const uploadthingUrl =
  import.meta.env.VITE_UPLOADTHING_URL || "/api/uploadthing";

export const UploadButton = generateUploadButton({ url: uploadthingUrl });
export const UploadDropzone = generateUploadDropzone({ url: uploadthingUrl });
export const { useUploadThing, uploadFiles } = generateReactHelpers({
  url: uploadthingUrl,
});
