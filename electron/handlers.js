/**
* handlers.js
* 
* Defines functions that are invokved by the frontend process through the ipcRenderer utlity.
* Used for accessing systems taht are normally inaccessible to web browsers, like the file system
*/
const path = require('path');
const fs = require('fs').promises;

async function putObject(app, event, filepath, content) {
   // Electron utlity to find the right app data dir for the OS
   // See: https://www.electronjs.org/docs/latest/api/app#appgetpathname
   const appData = app.getPath('appData'); 
   const absFilePath = path.join(appData, 'trellis', filepath);

   // Ensure directory exists
   await fs.mkdir(path.dirname(absFilePath), { recursive: true });
   
//    // Decode base64 and write file
//    const buffer = Buffer.from(content, 'base64');
   await fs.writeFile(absFilePath, content);
   return absFilePath;
}

async function getObject(app, event, filepath) {
   const appData = app.getPath('appData'); 
   const absFilePath = path.join(appData, 'trellis', filepath);
   
   // Read file and convert to base64
   const buffer = await fs.readFile(absFilePath);
   return buffer.toString();
}

function registerHandlers(app, ipcMain){
   ipcMain.handle('putObject', async (event, filepath, contentBase64) => {
       return await putObject(app, event, filepath, contentBase64);
   });
   
   ipcMain.handle('getObject', async (event, filepath) => {
       return await getObject(app, event, filepath);
   });
}

module.exports = {
   registerHandlers,
}