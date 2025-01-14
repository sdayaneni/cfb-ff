const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const FOLDER_NAME = 'team-logos';

exports.handler = async (event) => {
  try {
    // Get the team name from the query parameters
    const teamName = event.queryStringParameters?.teamName;
    if (!teamName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Team name is required' }),
      };
    }

    // Construct the S3 key for the team logo
    const key = `${FOLDER_NAME}/${teamName.toLowerCase()}.png`;

    // Check if the object exists
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.headObject(params).promise(); // Ensures the object exists

    // Return the pre-signed URL for the logo
    const url = s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: 3600, // URL expires in 1 hour
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ teamName, logoUrl: url }),
    };
  } catch (error) {
    console.error(error);

    if (error.code === 'NotFound') {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Logo not found' }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve logo' }),
    };
  }
};
