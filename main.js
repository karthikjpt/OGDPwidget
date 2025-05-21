const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 425,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load local HTML file with your widget
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit();
});

