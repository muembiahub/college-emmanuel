const {
  app,
  BrowserWindow
} = require("electron");

const path = require("path");
const fs = require("fs");

function createWindow() {

  const win = new BrowserWindow({

    width: 1400,
    height: 900,

    backgroundColor: "#ffffff",

    show: false,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }

  });


  win.once("ready-to-show", () => {
    win.show();
  });


  const indexPath = path.join(
    __dirname,
    "../frontend/dist/index.html"
  );

  console.log("Index :", indexPath);
  console.log("Existe :", fs.existsSync(indexPath));

  win.loadFile(indexPath);

  // win.webContents.openDevTools();

}


app.whenReady().then(() => {

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