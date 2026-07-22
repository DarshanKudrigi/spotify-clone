const ImageKit = require("@imagekit/nodejs");

const imagekitClient = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

async function uploadMusicFile(file) {
  if (!file || !file.buffer) {
    throw new Error("No file data provided");
  }

  const base64 = file.buffer.toString("base64");
  const hasImageKitConfig = Boolean(process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_URL_ENDPOINT);

  if (!hasImageKitConfig) {
    return `data:${file.mimetype || "application/octet-stream"};base64,${base64}`;
  }

  try {
    const result = await imagekitClient.upload({
      file: base64,
      fileName: `music-${Date.now()}-${file.originalname || "track"}`,
      folder: "All_Music_details",
      useUniqueFileName: true,
    });

    return result.url || result.filePath || result;
  } catch (error) {
    console.warn("ImageKit upload failed, falling back to base64 data", error.message);
    return `data:${file.mimetype || "application/octet-stream"};base64,${base64}`;
  }
}

module.exports = { uploadMusicFile };
