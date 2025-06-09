const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Send request to close the window
  closeWindow: () => ipcRenderer.send('close-window'),

  // Send request to get the saved startup preference
  getStartupPreference: () => {
    ipcRenderer.send('get-startup-preference');
  },

  // Listen for startup preference value from main process
  onStartupPreference: (callback) => {
    if (typeof callback === 'function') {
      ipcRenderer.on('startup-preference', (event, enabled) => {
        callback(Boolean(enabled));
      });
    }
  },

  // Set startup preference (true or false)
  setStartupPreference: (enabled) => {
    ipcRenderer.send('set-startup-preference', Boolean(enabled));
  }
});
