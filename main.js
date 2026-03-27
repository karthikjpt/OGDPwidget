const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let win;

// ⚠️ Only disable GPU if needed (Linux issues)
// app.commandLine.appendSwitch('disable-gpu');

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

    // 🔥 Performance-critical
    show: false,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Prevent fullscreen
  win.on('enter-full-screen', () => {
    win.setFullScreen(false);
  });

  win.setMenuBarVisibility(false);

  // 🔥 Load first
  win.loadFile('index.html');

  // 🔥 Show only when ready (removes blank delay)
  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    win = null;
  });
}

// IPC
ipcMain.on('close-window', () => {
  if (win) win.close();
});

// 🚀 Startup optimization
app.whenReady().then(() => {
  createWindow();

  // 🔥 Defer non-critical work
  setTimeout(() => {
    // future heavy tasks go here
  }, 100);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
