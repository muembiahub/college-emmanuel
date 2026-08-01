import express from "express";
import { requireApiAuth } from "../middlewares/apiRequireAuth.js";
import { createContactMessage , listerAllMessages
} from "../controllers/apiPublicControllers.js";

/* ===================================================== */
const router = express.Router();


/* =====================================================
   AUTH PROTECTION
===================================================== */
router.use(requireApiAuth);

/* =====================================================
   PUBLIC ROUTES
===================================================== */
router.post("/contact", createContactMessage);
router.get("/messages", listerAllMessages);


export default router;
