const { app, BrowserWindow, screen, ipcMain, Tray, Menu } = require('electron');
const path = require('path');

// Detect platform
const platform = process.platform;
const isLinux = platform === 'linux';

// Global reference
let win;
let tray;

// Optional: Fix graphics-related crashes on Linux/VMs
app.commandLine.appendSwitch('disable-gpu');

// Platform-specific icon paths
const icons = {
  win32: path.join(__dirname, 'build', 'icons', 'icon.ico'),
  linux: path.join(__dirname, 'build', 'icons', 'icon.png'),
  darwin: path.join(__dirname, 'build', 'icons', 'icon.png')
};
const iconPath = icons[platform] || icons.linux;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const widgetWidth = 400;

  win = new BrowserWindow({
    width: widgetWidth,
    height: height,
    x: width - widgetWidth,
    y: 0,
    resizable: false,
    frame: isLinux,          
    transparent: !isLinux,   
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    skipTaskbar: false,     // <-- show in taskbar
    icon: iconPath,
    title: 'OGDP Earthquake',
    minimizable: true,
    closable: true,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Prevent forced fullscreen
  win.on('enter-full-screen', () => win.setFullScreen(false));

  // Hide menu bar
  win.setMenuBarVisibility(false);

  // Load main HTML
  win.loadFile('index.html').catch(err => console.error('Failed to load index.html:', err));

  // Cleanup
  win.on('closed', () => win = null);
}

// Handle renderer close request
ipcMain.on('close-window', () => {
  if (win) {
    win.destroy();
    win = null;
  }
});

// Optional: Create a tray icon for quick access
app.whenReady().then(() => {
  createWindow();

  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Widget', click: () => { if (!win) createWindow(); else win.show(); } },
    { label: 'Exit', click: () => { app.quit(); } }
  ]);
  tray.setToolTip('OGDP Earthquake Widget');
  tray.setContextMenu(contextMenu);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit app except on macOS
app.on('window-all-closed', () => {
  if (platform !== 'darwin') app.quit();
});

// Global error handling
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('Unhandled Promise Rejection:', reason));
