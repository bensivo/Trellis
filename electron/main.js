const { app, BrowserWindow, ipcMain, protocol, net } = require('electron');
const { registerHandlers } = require('./handlers.js');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload script registers all IPC functions between frontend and node processes
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // NOTE: the 'browser' dir is a symlink to app/dist/trellis-app/browser/, which is where angular builds the Static site to
  win.loadURL(`file://${path.join(__dirname, 'browser/index.html')}`)
}

// For MacOS, becuase the app can be running without any windows open, we have to listen
// to the 'activate' event, and create a new window.
app.whenReady().then(() => {

  // Custom file protocol used for files stored in the local 'trellis' application directory
  // allows the browser to reference files in that dir by using trellis://<relative_path> 
  protocol.handle('trellis', (request) => {
    const filePath = request.url.replace('trellis://', '');
    const appData = app.getPath('appData');
    const fullPath = path.join(appData, 'trellis', filePath);
    console.log('Fetching file: ', fullPath)
    return net.fetch(`file://${fullPath}`);
  });

  // Setup all IPC handlers
  ipcMain.handle('ping', (event, counter) => {
    console.log('Received ping', counter);
    return counter * 2;
  });

  registerHandlers(app, ipcMain);

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Kill the app once all windows close. Mostly for linux and windows.
// On MacOS, apps can keep running even with no windows open.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

