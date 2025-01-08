const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const port = 3000;

// Configure AWS S3
const s3 = new AWS.S3({
  region: 'your-region', // e.g., 'us-east-1'
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
});

const BUCKET_NAME = 'sdfnfantasyfootball';
const FOLDER_NAME = 'school-logos';

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
