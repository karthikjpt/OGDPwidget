const { contextBridge, ipcRenderer } = require('electron');

// Expose limited, safe API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (msg) => ipcRenderer.send('message', msg),
  onMessage: (callback) => ipcRenderer.on('reply', (event, data) => callback(data))
});

