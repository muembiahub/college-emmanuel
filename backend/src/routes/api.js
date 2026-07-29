import express from "express";
import { createContactMessage , listerAllMessages
} from "../controllers/apiPublicControllers.js";

/* ===================================================== */
const router = express.Router();


/* =====================================================
   PUBLIC ROUTES
===================================================== */
router.post("/contact", createContactMessage);
router.get ("/messages", listerAllMessages);


export default router;
