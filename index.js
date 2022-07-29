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

async function uploadFile(filePath) {
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
    return response.data.id;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function generatePublicUrl(fileId) {
  try {
    const response = await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

async function getFileUrl(fileId) {
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteFile(fileId) {
  try {
    const response = await drive.files.delete({
      fileId: fileId,
    });
    console.log(response.status);
  } catch (error) {
    console.log(error.message);
  }
}

async function main() {
  const fileId = await uploadFile(filePath);
  if (!fileId) return;
  await generatePublicUrl(fileId);
  await getFileUrl(fileId);
  await deleteFile(fileId);
}

main();
