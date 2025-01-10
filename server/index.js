const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const port = 3000;

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const FOLDER_NAME = process.env.S3_FOLDER_NAME;

// API endpoint to list school logos
app.get('/logos', async (req, res) => {
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

    res.json(logos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve school logos' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
