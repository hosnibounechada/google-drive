const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const filePath = path.join(__dirname, "bounechada.JPG");

async function uploadFile() {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "hosni.JPG",
        mimeType: "image/jpg",
      },
      media: {
        mimeType: "image/jpg",
        body: fs.createReadStream(filePath),
      },
    });
    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteFile() {
  try {
    const response = await drive.files.delete({
      fileId: "1rl4-7KfLb7mmZMIMftt7JWqERn8pWUHP",
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function generatePublicUrl() {
  try {
    await drive.permissions.create({
      fileId: "1WOlay9gLbVQfjpJjEw2K2KqK1DggSRJV",
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function getFileUrl() {
  try {
    const response = await drive.files.get({
      fileId: "1WOlay9gLbVQfjpJjEw2K2KqK1DggSRJV",
      fields: "webViewLink, webContentLink",
    });
    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

getFileUrl();
