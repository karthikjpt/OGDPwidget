const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('OGDP', {
  openExternal: (url) => shell.openExternal(url), // ✅ NEW

  window: {
    close: () => ipcRenderer.send('close-window')
  },

  data: {
    fetch: () => ipcRenderer.invoke('get-data')
  },

  settings: {
    update: (key, value) => ipcRenderer.send('update-settings', { key, value }),
    get: (key) => ipcRenderer.invoke('get-settings', key)
  }
});
