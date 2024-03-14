const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dabdwmytk', 
  api_key: "344979813441562", 
  api_secret: '0_5iBiCMw42A4mM0BCJ29sxKyNg'
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUploads, (result, error) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
          resource_type: "auto"
        });
      }
    });
  });
};
const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve,reject) => {
    cloudinary.uploader.destroy(fileToDelete, (result,error) => {
      if (error) {
        reject(error);
      }
      else{
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
            resource_type: "auto",
          }
        );
      }
    });
  });
};


module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
