const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const widgetWidth = 400;

  // Platform-specific icon path
  let iconPath;
  if (process.platform === 'win32') {
    iconPath = path.join(__dirname, 'build', 'icons', 'icon.ico');
  } else if (process.platform === 'linux') {
    iconPath = path.join(__dirname, 'build', 'icons', 'icon.png');
  } else if (process.platform === 'darwin') {
    // Optional for development (macOS uses .icns at packaging time)
    iconPath = path.join(__dirname, 'build', 'icons', 'icon.png');
  }

  win = new BrowserWindow({
    width: widgetWidth,
    height: height,
    x: width - widgetWidth,
    y: 0,
    resizable: false,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    icon: iconPath, // Works in Windows & Linux; macOS uses .icns when packaged
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
  win.setMenuBarVisibility(false);
}

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
