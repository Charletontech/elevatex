const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configure cloudinary via environment variable CLOUDINARY_URL or individual vars
// Prefer `CLOUDINARY_URL` if provided, otherwise configure from individual vars
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ url: process.env.CLOUDINARY_URL });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Basic validation to help troubleshooting invalid signature errors
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn(
    "Cloudinary configuration appears incomplete. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment."
  );
} else {
  // Avoid logging secrets; just confirm values are present
  console.log(
    "Cloudinary configured for cloud:",
    process.env.CLOUDINARY_CLOUD_NAME
  );
}

async function uploadFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

async function uploadStream(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function removeLocalFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    // ignore errors when removing file
    // console.warn('Failed to remove temp file', filePath, err.message);
  }
}

async function removeRemoteFile(publicId) {
  if (!publicId) return;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

module.exports = {
  uploadFile,
  uploadStream,
  removeLocalFile,
  removeRemoteFile,
  cloudinary,
};
