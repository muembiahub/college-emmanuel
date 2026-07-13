import { app, BrowserWindow, session } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  console.log("🚀 Lancement Electron - Connexion Directe Cloud");

  const isDev = !app.isPackaged;

  // 1. Fenêtre Splash Screen
  const splash = new BrowserWindow({
    width: 450,
    height: 350,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Chemin du splash selon environnement
  const splashPath = isDev
    ? path.join(__dirname, "assets", "splash.html")
    : path.join(process.resourcesPath, "assets", "splash.html");

  console.log("Chemin splash utilisé :", splashPath);
  splash.loadFile(splashPath);
  console.log("⏳ Affichage de l'écran de chargement animé");

  // 2. Fenêtre principale
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      secureModules: true,
      sandbox: true
    }
  });

  // 3. Optimisation des headers pour cookies cross-origin
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    const setCookieKey = responseHeaders["set-cookie"]
      ? "set-cookie"
      : responseHeaders["Set-Cookie"]
      ? "Set-Cookie"
      : null;

    if (setCookieKey) {
      responseHeaders[setCookieKey] = responseHeaders[setCookieKey].map(cookie => {
        if (!cookie.includes("SameSite=")) {
          return `${cookie}; SameSite=None; Secure`;
        }
        return cookie;
      });
    }
    callback({ cancel: false, responseHeaders });
  });

  // 4. User-Agent personnalisé
  win.webContents.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Electron/27.0.0 Safari/537.36"
  );

  // 5. URL cible
  const targetURL = "https://college-emmanuel.onrender.com/#/login";
  console.log("🌐 Chargement distant :", targetURL);

  let appReady = false;
  let splashMinimumDisplayTime = false;

  // Timer splash minimum 3s
  const splashTimer = setTimeout(() => {
    splashMinimumDisplayTime = true;
    console.log("⏱️ Durée minimale du splash atteinte (3s)");

    if (appReady) {
      splash.destroy();
      win.show();
      console.log("✅ Application chargée depuis Render !");
    }
  }, 3000);

  // 6. Charger l’app web
  win.loadURL(targetURL)
    .then(() => {
      appReady = true;
      console.log("✅ Application prête à être affichée");

      if (splashMinimumDisplayTime) {
        splash.destroy();
        win.show();
        console.log("✅ Application chargée depuis Render !");
      }
    })
    .catch(error => {
      console.error("❌ Erreur de connexion au serveur Render :", error);
      clearTimeout(splashTimer);

      splash.destroy();
      win.show();

      win.webContents.executeJavaScript(`
        alert('Erreur de connexion au serveur. Veuillez vérifier votre connexion Internet.');
      `).catch(err =>
        console.error("Erreur lors de l'affichage du message d'erreur :", err)
      );
    });

  // 7. Gestion fermeture
  win.on("closed", () => {
    console.log("🔚 Fenêtre principale fermée");
    clearTimeout(splashTimer);
  });

  // 8. DevTools (uniquement en dev)
  // if (isDev) win.webContents.openDevTools();
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

// Gestion exceptions non capturées
process.on("uncaughtException", error => {
  console.error("❌ Exception non gérée :", error);
});
