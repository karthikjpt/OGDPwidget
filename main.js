const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 350,
    height: 425,
    resizable: false,
    frame: false,                // Frameless window (no OS border)
    transparent: true,           // Allow transparent background
    alwaysOnTop: false,           // Optional: keep widget above other windows
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('index.html');

  // Optional: Remove default menu bar
  win.setMenuBarVisibility(false);
}

// Handle custom close command from renderer
ipcMain.on('close-window', () => {
  if (win) win.close();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
