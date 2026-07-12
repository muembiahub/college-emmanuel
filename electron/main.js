import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



function createWindow() {

  console.log("🚀 Lancement Electron Production");


  const win = new BrowserWindow({

    width: 1400,
    height: 900,

    webPreferences: {

      nodeIntegration: false,
      contextIsolation: true

    }

  });



  const indexPath = path.join(
    __dirname,
    "../dist/index.html"
  );


  console.log(
    "📂 Chargement:",
    indexPath
  );


  win.loadFile(indexPath)
    .then(() => {

      console.log("✅ Application chargée");

    })
    .catch((error)=>{

      console.error(
        "❌ Erreur chargement Electron:",
        error
      );

    });


}



app.whenReady()
.then(()=>{

  createWindow();


  app.on(
    "activate",
    ()=>{

      if(
        BrowserWindow.getAllWindows().length === 0
      ){

        createWindow();

      }

    }
  );

});



app.on(
 "window-all-closed",
 ()=>{

   if(process.platform !== "darwin"){

     app.quit();

   }

 }
);