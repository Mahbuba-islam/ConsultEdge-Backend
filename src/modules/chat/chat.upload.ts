import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { cloudinaryUpload } from "../../config/cloudinary.config";

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (_req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLowerCase();
    const fileNameWithoutExtension = originalName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9/-]/g, "");

    const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;
    const folder = extension === "pdf" ? "pdfs" : "chat";

    return {
      folder: `consultedge/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
    };
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    cb(new Error("Invalid file type. Allowed: PDF, PNG, JPG, DOCX"));
    return;
  }

  cb(null, true);
};

export const chatUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

type CloudinaryMulterFile = Express.Multer.File & {
  path?: string;
  secure_url?: string;
};

export const mapUploadedFileToAttachmentData = (file: Express.Multer.File) => {
  const cloudinaryFile = file as CloudinaryMulterFile;
  const fileUrl = cloudinaryFile.path ?? cloudinaryFile.secure_url;

  if (!fileUrl) {
    throw new Error("Failed to resolve uploaded file URL from Cloudinary");
  }

  return {
    fileUrl,
    fileName: file.originalname,
    fileType: file.mimetype,
    fileSize: file.size,
  };
};
