const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
  constructor() {}

 /**
  * The function uploads an image file to Cloudinary and returns the uploaded image data.
  * @param file - The `file` parameter is the file object that contains the image file to be uploaded.
  * It should have a `path` property that represents the path to the image file on the local system.
  * @returns the data object that is obtained from uploading the image to Cloudinary.
  */
  static async uploadImage(file) {
    const data = await cloudinary.uploader.upload(file.path);
    return data;
  }

  /**
   * The function `uploadFiles` uploads files to Cloudinary and returns the uploaded data.
   * @param files - The `files` parameter is an array of files that you want to upload to Cloudinary.
   * Each file in the array should be a valid file object or a URL string.
   * @returns the data object that is obtained after uploading the files to Cloudinary.
   */
  static async uploadFiles(files) {
    const data = await cloudinary.uploader.upload(files, {
      resource_type: 'raw',
      use_filename: true,
    });
    return data;
  }

  /* The `findSignature` function is a static method of the `CloudinaryService` class. It generates a
  signature for a given folder using the Cloudinary API. */
  static async findSignature(folder) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const data = await cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      process.env.API_SECRET
    );
    return { timestamp, data };
  }
}

module.exports = CloudinaryService;
