
import { supabase } from "../config/database.js";
import {
  insertContactMessage,
} from "../models/contactModel.js";





/* =====================================================
   CONTACT
===================================================== */
// 🔹 Contrôleur pour insérer un message de contact
export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Vérification des champs obligatoires
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Insertion via Supabase
    const contact = await insertContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

