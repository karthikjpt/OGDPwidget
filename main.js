const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let win;

// Optional: Fix graphics-related crashes (especially on Linux/VMs)
app.commandLine.appendSwitch('disable-gpu');

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
    backgroundColor: '#00000000',
    alwaysOnTop: false,
    skipTaskbar: false,
    icon: iconPath,
    fullscreenable: false, // ❗️Prevents fullscreen via F11 or green button
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  // Prevent forced programmatic fullscreen (safety net)
  win.on('enter-full-screen', () => {
    win.setFullScreen(false);
  });

  win.setMenuBarVisibility(false);

  win.loadFile('index.html').catch(err => {
    console.error('Failed to load index.html:', err);
  });

  // Clean up reference on close
  win.on('closed', () => {
    win = null;
  });
}

// Handle renderer close request
ipcMain.on('close-window', () => {
  if (win) win.close();
});

// App ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit unless on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

