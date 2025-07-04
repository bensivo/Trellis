/**
 * Preload scripts are required to setup IPC between the frontend portion of the app (running the web app)
 * and the backend portion (running node.js)
 *
 * NOTE: preload scripts run in the renderer
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ping: (counter) => ipcRenderer.invoke('ping', counter),
})
