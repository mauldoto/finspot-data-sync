const { app, BrowserWindow } = require('electron/main')
const path = require('path')
const { registerOpenDialogHandler } = require('./controller/ipcController')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        // preload: path.join(__dirname, 'preload.js'), // optional
        nodeIntegration: true,
        contextIsolation: false,
    }
  })

  win.loadFile(path.join(__dirname, 'views', 'index.html'))
}

app.whenReady().then(() => {
    registerOpenDialogHandler();
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        }
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})