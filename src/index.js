const express = require('express');
const request = require('request');
const fs = require('fs');
const AdmZip = require('adm-zip');
// const os = require('os');
// const path = require('path');

const app = express();

downloadFile();

function downloadFile() {
  out = fs.createWriteStream('./src/files.zip');
  
  const req = request(
    {
      method: 'GET',
      url: 'https://github.com/FillipeDiord/Files/archive/refs/heads/main.zip',
      headers: {
        Authorization: 'token {TOKEN}',
        Accept: 'application/vnd.github.v3+json',
        Encoding: 'null',
      }
    }
  );

  req.pipe(out);
  req.on('end', function () {
    unzipFiles('./src/files.zip');
  });
}

async function unzipFiles(zipFileDirectory) {
  const nameFileDirectory = zipFileDirectory;
  const zip = new AdmZip(nameFileDirectory);

  zipEntries = zip.getEntries();
  zip.extractAllTo('./src/files/', true);
}

function getFiles(directory, files) {

  if (!files) {
    files = [];
  }

  const listFiles = fs.readdirSync(directory);
  let arrayFiles = [];
  
  listFiles.forEach(file => {
    let stat = fs.statSync(directory + '/' + file);
    if (stat.isDirectory()) {
      getFiles(directory + '/' + file, files);
    } else {
      const objectFile = fs.readFileSync(directory + '/' + file);
      // console.log('Archive:', objectFile);
      arrayFiles.push(objectFile);
      console.log('Array Files', arrayFiles);
      files.push('/' + file);
    }
  });

  return arrayFiles;
}

let filesList = getFiles('./src/files/');
console.log('Lista de arquivos', filesList);

app.listen(3333);
