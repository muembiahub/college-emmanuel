import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charge le .env situé à la racine du backend
dotenv.config({
  path: resolve(__dirname, "../../.env"),
});


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;


if (!supabaseUrl) {
  throw new Error(
    "❌ SUPABASE_URL manquant dans le fichier .env"
  );
}

if (!supabaseKey) {
  throw new Error(
    "❌ SUPABASE_SERVICE_ROLE_KEY manquant dans le fichier .env"
  );
}


export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    realtime: {
      transport: ws,
    },
  }
);


console.log("✅ Supabase connecté :", supabaseUrl);