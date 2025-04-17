const { app, BrowserWindow, Menu, shell } = require("electron/main");
const path = require("path");
const { registerIpcHandler } = require("./controller/ipcController");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    icon: path.join(__dirname, "assets/icon.ico"),
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'), // optional
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, "views", "index.html"));
  // win.webContents.openDevTools();

  // Menu template
  const template = [
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            win.webContents.send(
              "alert-about",
              "Aplikasi ini dibuat oleh mantanIT"
            );
          },
        },
        {
          label: "Lu islam? jangan lupa baca quran",
          click: () => {
            shell.openExternal("https://mauldoto.github.io/");
          },
        },
        {
          type: "separator", // Membuat pemisah antara menu
        },
        {
          label: "Exit",
          click: () => {
            app.quit();
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu); // Set menu ke aplikasi
};

app.whenReady().then(() => {
  registerIpcHandler();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
