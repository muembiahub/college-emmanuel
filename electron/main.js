import { app, BrowserWindow, session } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  console.log("🚀 Lancement Electron - Connexion Directe Cloud");

  // 1. Create the temporary Splash Screen window (frameless and centered)
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

  // Load the animation file locally
  splash.loadFile(path.join(__dirname, "splash.html"));
  console.log("⏳ Affichage de l'écran de chargement animé");

  // 2. Create the main application window (hidden by default)
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false, // Keep hidden while Render wakes up
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      secureModules: true,
      sandbox: true
    }
  });

  // 3. Optimize headers for session handling over cross-origin states
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    const setCookieKey = responseHeaders['set-cookie'] ? 'set-cookie' : (responseHeaders['Set-Cookie'] ? 'Set-Cookie' : null);
    
    if (setCookieKey) {
      responseHeaders[setCookieKey] = responseHeaders[setCookieKey].map(cookie => {
        if (!cookie.includes('SameSite=')) {
          return `${cookie}; SameSite=None; Secure`;
        }
        return cookie;
      });
    }
    callback({ cancel: false, responseHeaders });
  });

  // 4. Add User-Agent customization for better server compatibility
  win.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Electron/27.0.0 Safari/537.36'
  );

  // Target URL directly forcing the hash router route
  const targetURL = "https://college-emmanuel.onrender.com/#/login";
  console.log("🌐 Chargement distant :", targetURL);

  // 5. Track when the app is ready to be shown
  let appReady = false;
  let splashMinimumDisplayTime = false;

  // Set a minimum display time for the splash screen (3 seconds)
  const splashTimer = setTimeout(() => {
    splashMinimumDisplayTime = true;
    console.log("⏱️  Durée minimale du splash atteinte (3s)");
    
    // If app is already ready, close splash and show main window
    if (appReady) {
      splash.destroy();
      win.show();
      console.log("✅ Application chargée depuis Render !");
    }
  }, 5000); // 3000ms = 3 seconds

  // 6. Load the web app URL
  win.loadURL(targetURL)
    .then(() => {
      appReady = true;
      console.log("✅ Application prête à être affichée");
      
      // If minimum splash time has passed, show the app immediately
      if (splashMinimumDisplayTime) {
        splash.destroy();
        win.show();
        console.log("✅ Application chargée depuis Render !");
      }
      // Otherwise, wait for the timer to complete
    })
    .catch((error) => {
      console.error("❌ Erreur de connexion au serveur Render :", error);
      clearTimeout(splashTimer);
      
      // Fallback: don't leave user hanging if Render fails completely
      splash.destroy();
      win.show();
      
      // Optionally show error message to user
      win.webContents.executeJavaScript(`
        alert('Erreur de connexion au serveur. Veuillez vérifier votre connexion Internet.');
      `).catch(err => console.error('Erreur lors de l\'affichage du message d\'erreur :', err));
    });

  // 7. Handle window closed
  win.on('closed', () => {
    console.log("🔚 Fenêtre principale fermée");
    clearTimeout(splashTimer);
  });

  // 8. Open DevTools in development (comment in production)
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

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Exception non gérée :', error);
});
