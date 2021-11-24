const express = require('express');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

const app = express();

app.get("/", (request, response) => {
  return response.json({ Message: "Hello World!" });
});

const directories = [];
const downloadableFileObjects = [];

const listDirectories = {
  method: 'GET',
  url: 'https://api.github.com/repos/FillipeDiord/files/contents',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: 'token {TOKEN}'
  }
};

axios.request(listDirectories).then(async function (response) {
  const listUrlDirectories = response.data;

  await listUrlDirectories.forEach(directory => {
    directories.push(directory.name);
  });

  groupingFiles(directories);

}).catch(function (error) {
  console.error(error);
});

const groupingFiles = (directories) => {

  directories.forEach(directory => {
    const listFiles = {
      method: 'GET',
      url: `https://api.github.com/repos/FillipeDiord/files/contents/${directory}`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token {TOKEN}'
      }
    };

    axios.request(listFiles).then(function (response) {
      const files = response.data;

      files.forEach(file => {
        downloadableFileObjects.push({
          name: file.name,
          path: file.path
        });
      });

      downloadFiles(downloadableFileObjects);

    }).catch(function (error) {
      console.error(error);
    });
  });
}

const downloadFiles = (downloadableFileObjects) => {

  console.log('downloadableFileObjects', downloadableFileObjects);

  downloadableFileObjects.forEach(downloadableFileObject => {
    const url = `https://raw.githubusercontent.com/FillipeDiord/files/main/${downloadableFileObject.path}`;

    request({
      url, encoding: null, headers: {
        Authorization: 'token {TOKEN}',
        Accept: 'application/vnd.github.v3+json',
      },
    }, function (err, resp, body) {
      console.log('Archive', body);

      // const firmwareObject = {
      //   file_name: fileObject.name,
      //   file: body
      // };

      // firmwares.push(firmwareObject);

      // console.log('FIRMWARES', firmwares.length);
      const fileName = 'image.png';

      if (err) throw err;
      fs.writeFile(fileName, body, function (err) {
        console.log('file written!');
      });
    });
  });
}

app.listen(3333);