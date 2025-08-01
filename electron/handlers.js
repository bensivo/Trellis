/**
* handlers.js
* 
* Defines functions that are invokved by the frontend process through the ipcRenderer utlity.
* Used for accessing systems taht are normally inaccessible to web browsers, like the file system
*/
const path = require('path');
const fs = require('fs').promises;

async function putObject(app, event, filepath, content, encoding = 'utf8') {
   // Electron utlity to find the right app data dir for the OS
   // See: https://www.electronjs.org/docs/latest/api/app#appgetpathname
   const appData = app.getPath('appData'); 
   const absFilePath = path.join(appData, 'trellis', filepath);

   await fs.mkdir(path.dirname(absFilePath), { recursive: true });
   
   const buffer = Buffer.from(content, encoding);
   await fs.writeFile(absFilePath, buffer);
   console.log('putObject: file written to ', absFilePath)
   return absFilePath;
}

async function getObject(app, event, filepath, encoding = 'utf8') {
   const appData = app.getPath('appData'); 
   const absFilePath = path.join(appData, 'trellis', filepath);

   // const exists = fs.existsSync(absFilePath);
   // if (!exists) {
   //    console.warn("Requested file not found", filepath, absFilePath)
   //    return null;
   // }
   
   try {
      // Read file and convert to base64
      const buffer = await fs.readFile(absFilePath);
      return buffer.toString(encoding);
   } catch (e) {
      console.warn('Failed to read file', e);
      return null;
   }
}

function registerHandlers(app, ipcMain){
   ipcMain.handle('putObject', async (event, filepath, contentBase64, encoding = 'utf8') => {
       return await putObject(app, event, filepath, contentBase64, encoding);
   });
   
   ipcMain.handle('getObject', async (event, filepath, encoding = 'utf8') => {
       return await getObject(app, event, filepath, encoding);
   });
}

module.exports = {
   registerHandlers,
}