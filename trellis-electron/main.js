const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
      webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
      },
  });

  win.loadFile('index.html');
}

// For MacOS, becuase the app can be running without any windows open, we have to listen
// to the 'activate' event, and create a new window.
app.whenReady().then(() => {

  // Setup all IPC handlers
  ipcMain.handle('ping', (event, counter) => {
    console.log('Received ping', counter);
    return counter*2;
  });

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

