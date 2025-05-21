const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 425,
    frame: false,           // Frameless window for clean widget look
    transparent: true,      // Transparent background, so widget UI can blend with desktop
    alwaysOnTop: true,      // Keep widget visible above other windows
    resizable: false,       // Prevent resizing
    skipTaskbar: true,      // Hide from taskbar for widget feel
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + '/preload.js'  // (Optional) preload script for safe node API exposure
    }
  });

  win.loadFile('index.html');

  // Remove the menu bar completely
  win.setMenu(null);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

