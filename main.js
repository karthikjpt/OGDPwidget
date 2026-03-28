const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const widgetWidth = 400;

  const iconMap = {
    win32: 'icon.ico',
    linux: 'icon.png',
    darwin: 'icon.png'
  };

  const iconPath = path.join(__dirname, 'build', 'icons', iconMap[process.platform]);

  win = new BrowserWindow({
    width: widgetWidth,
    height,
    x: width - widgetWidth,
    y: 0,
    resizable: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: false,
    skipTaskbar: false,
    icon: iconPath,
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  win.on('enter-full-screen', () => {
    win.setFullScreen(false);
  });

  win.setMenuBarVisibility(false);

  win.loadFile('index.html');

  // ✅ Security: block navigation
  win.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });

  // ✅ Security: block new windows
  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    win = null;
  });
}

ipcMain.on('close-window', () => {
  if (win) win.close();
});

app.whenReady().then(() => {
  createWindow();

  setTimeout(() => {}, 100);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
