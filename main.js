const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const PREF_PATH = path.join(app.getPath('userData'), 'user-preferences.json');

function loadPreferences() {
  try {
    return JSON.parse(fs.readFileSync(PREF_PATH));
  } catch {
    return { startup: false };
  }
}

function savePreferences(prefs) {
  fs.writeFileSync(PREF_PATH, JSON.stringify(prefs, null, 2));
}

let win;

// Optional: Fix graphics-related crashes
app.commandLine.appendSwitch('disable-gpu');

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const widgetWidth = 400;

  let iconPath;
  if (process.platform === 'win32') {
    iconPath = path.join(__dirname, 'build', 'icons', 'icon.ico');
  } else {
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
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.on('enter-full-screen', () => {
    win.setFullScreen(false);
  });

  win.setMenuBarVisibility(false);

  win.loadFile('index.html').catch(err => {
    console.error('Failed to load index.html:', err);
  });

  win.on('closed', () => {
    win = null;
  });
}

// Handle renderer events
ipcMain.on('close-window', () => {
  if (win) win.close();
});

ipcMain.on('get-startup-preference', (event) => {
  event.reply('startup-preference', loadPreferences().startup || false);
});

ipcMain.on('set-startup-preference', (event, enabled) => {
  const updated = { ...loadPreferences(), startup: enabled };
  savePreferences(updated);
  app.setLoginItemSettings({
    openAtLogin: enabled
  });
});

// App ready
app.whenReady().then(() => {
  createWindow();

  // Restore saved startup preference
  const prefs = loadPreferences();
  app.setLoginItemSettings({
    openAtLogin: prefs.startup || false
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit on all windows closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
