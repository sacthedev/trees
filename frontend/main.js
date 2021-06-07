/* eslint-disable require-jsdoc */
const {app, BrowserWindow} = require('electron');

const URL = 'http://localhost:3000';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/src/logo.ico',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(URL);

  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
