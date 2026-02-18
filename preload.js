const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('OGDP', {
  window: {
    close: () => ipcRenderer.send('close-window')
  },
  data: {
    // Example: request data from main process (returns a Promise)
    fetch: () => ipcRenderer.invoke('get-data')
  },
  settings: {
    // Example: update or get settings via IPC
    update: (key, value) => ipcRenderer.send('update-settings', { key, value }),
    get: (key) => ipcRenderer.invoke('get-settings', key)
  }
});
