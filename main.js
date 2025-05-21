const { app, BrowserWindow, ipcMain } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 350,
    height: 425,
    frame: false,            // frameless window for custom controls
    transparent: true,
    webPreferences: {
      preload: __dirname + '/preload.js',
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('close-window', () => {
  if (win) win.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
