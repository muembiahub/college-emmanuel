import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";
import cors from "cors";

import { fileURLToPath } from "url";

import apiRoutes from "./src/routes/api.js";
import authRouter from "./src/routes/apiAuthRoutes.js";
import dashboardRouter from "./src/routes/scolaireRoutes.js";


/* =========================================================
   ENV
========================================================= */

dotenv.config();


const app = express();


const NODE_ENV =
  (process.env.NODE_ENV || "development").trim();


const PORT =
  process.env.PORT || 3000;


const SUPABASE_URL =
  (process.env.SUPABASE_URL || "").trim();



/* =========================================================
   MIDDLEWARE
========================================================= */


app.use(
  cors({

    origin: [
      "http://localhost:5173",
      "http://localhost:3000"
    ],

    credentials:true

  })
);



app.use(

  session({

    secret:
      process.env.SESSION_SECRET ||
      "college-emmanuel-secret",


    resave:false,


    saveUninitialized:false,


    cookie:{

      httpOnly:true,

      secure:false,

      maxAge:
        24 * 60 * 60 * 1000

    }

  })

);



app.use(express.json());


app.use(
  express.urlencoded({
    extended:true
  })
);



app.set(
  "trust proxy",
  1
);




/* =========================================================
   SECURITY
========================================================= */


app.use(

 helmet({

  contentSecurityPolicy:false

 })

);





/* =========================================================
   LOGGER
========================================================= */


if(
 NODE_ENV === "development"
){

 app.use(
   (req,res,next)=>{

    console.log(
      `➡️ ${req.method} ${req.url}`
    );


    next();

   }
 );

}





/* =========================================================
   API ROUTES
========================================================= */


app.use(
 "/api",
 apiRoutes
);


app.use(
 "/",
 authRouter
);


app.use(
 "/dashboard",
 dashboardRouter
);





/* =========================================================
   FRONTEND STATIC
========================================================= */


const __filename =
  fileURLToPath(import.meta.url);


const __dirname =
  path.dirname(__filename);



let clientPath;



/*
   En développement :

   backend/
   frontend/dist

*/


if(
 process.env.NODE_ENV === "development"
){


 clientPath =
 path.resolve(
   __dirname,
   "../frontend/dist"
 );


}


/*
   En Electron :

   resources/
      frontend/

*/


else{


 clientPath =
 path.join(
   process.resourcesPath,
   "frontend"
 );


}



console.log(
 "Frontend path:",
 clientPath
);



app.use(
 express.static(clientPath)
);



app.get(
 "*",
 (req,res)=>{


  res.sendFile(
    path.join(
      clientPath,
      "index.html"
    )
  );


 }

);





/* =========================================================
   ERROR HANDLER
========================================================= */


app.use(

(err,req,res,next)=>{


 console.error(
   "❌ Error:",
   err.message
 );


 res.status(
   err.status || 500
 )
 .json({

   success:false,

   error:
    err.message ||
    "Erreur serveur"

 });


}

);





/* =========================================================
   START SERVER
========================================================= */


app.listen(
 PORT,
 ()=>{


 console.log(
   `✅ Server running at port ${PORT}`
 );


 console.log(
   `🌱 Environment: ${NODE_ENV}`
 );


 console.log(
   "🚀 College Emmanuel ready"
 );


}
);