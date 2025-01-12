const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const FOLDER_NAME = process.env.S3_FOLDER_NAME;

exports.handler = async (event) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: `${FOLDER_NAME}/`,
    };

    const data = await s3.listObjectsV2(params).promise();
    const logos = data.Contents.map((item) => ({
      key: item.Key,
      url: `https://${BUCKET_NAME}.s3.amazonaws.com/${item.Key}`,
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logos),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to retrieve school logos' }),
    };
  }
};