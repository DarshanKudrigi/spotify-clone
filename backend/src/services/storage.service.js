const ImageKit = require("@imagekit/nodejs");


const imagekitClient = new ImageKit({
    // publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    // urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage(file) {
    const result = await imagekitClient.upload({
        file,
        fileName: "music" + Date.now() + ".jpg",
        folder: "All_Music_details"
    });
    return result.url;  
}

module.exports = { uploadImage }
