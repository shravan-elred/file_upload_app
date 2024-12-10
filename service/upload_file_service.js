const aws = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadSampleFile() {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: "sample/sample.jpg",
    ContentType: "image/jpg",
    Body: fs.createReadStream("./sample/sample.jpg"),
  };

  s3.upload(params, (error, response) => {
    fs.unlink(file.path, (error) => {
      return console.error(error);
    });
    if (error) console.error(error);
    else console.log(response);
  });
}
