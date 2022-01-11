const express = require('express');
const axios = require('axios');

const app = express();

downloadFiles();

async function downloadFiles() {
  try {
    const fileTree = [];
    const temporaryUrlFiles = [];
    const listFolders = [];
    const branchName = 'homologation';

    const infoDirectories = {
      method: 'GET',
      url: 'https://api.github.com/repos/FillipeDiord/Files/contents',
      params: { ref: branchName },
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    };

    const listDirectories = await axios.request(infoDirectories)
      .catch(function (error) {
        console.log(error);
      });
    const listUrlDirectories = listDirectories.data;

    const directories = await listUrlDirectories.filter(directory =>
      directory.name !== 'LICENSE' && directory.name !== 'README.md');

    for (const directory of directories) {
      const urlDirectory = {
        method: 'GET',
        url: `https://api.github.com/repos/FillipeDiord/Files/contents/${directory.name}`,
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      };
      await listFolders.push(urlDirectory);
    }

    for (const folder of listFolders) {
      const result = await axios.request(folder)
        .catch(function (error) {
          console.log(error);
        });
      await temporaryUrlFiles.push(result.data);
    }

    for (const temporaryFile of temporaryUrlFiles) {
      for (const file of temporaryFile) {
        fileTree.push(file);
      }
    }

    for (const file of fileTree) {
      const url = `https://raw.githubusercontent.com/FillipeDiord/Files/${branchName}/${file.path}`;

      const response = await axios.request({
        method: 'GET',
        url: url,
        headers: {
          Accept: 'application/vnd.github.v3+json'
        },
        responseType: 'arraybuffer',
        responseEncoding: 'binary'
      }).catch(function (error) {
        console.log(error);
      });

      const dataArchive = await response.data;

      const binData = await dataArchive;
      const nameFile = file.name;

      const firmwareVersion = {
        fileName: nameFile,
        file: await binData
      };

      console.log('firmwareVersion', firmwareVersion);
    }
  } catch (error) {
    throw error;
  }
}

app.listen(3333);