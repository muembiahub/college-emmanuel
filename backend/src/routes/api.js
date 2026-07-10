import express from "express";
import { createContactMessage 
} from "../controllers/apiPublicControllers.js";


/* ===================================================== */
const router = express.Router();


/* =====================================================
   PUBLIC ROUTES
===================================================== */
router.post("/contact", createContactMessage);


export default router;
