/**
 * preload.js
 * 
 * Defines IPC functions which can be called by the frontend part of our electron app.
 * 
 * NOTE: all of these function calls are received in the handlers defined in handlers.js
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  putObject: (path, contentBase64, encoding='utf8') => ipcRenderer.invoke('putObject', path, contentBase64, encoding),
  getObject: (path, encoding='utf8') => ipcRenderer.invoke('getObject', path, encoding)
})

