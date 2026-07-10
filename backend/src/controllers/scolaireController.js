import {
  getDashboardHome,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getNiveaux,
  getSections,
  getClasses,
  getParalleles,
  createEleve,
  getEleves
} from "../models/scolaireModel.js";

import { notifyInscription } from "../services/notifications.js";



/* =====================================================
   DASHBOARD HOME
===================================================== */


export const afficherDashboard = async (req, res) => {

  try {

    const dashboard = await getDashboardHome();


    res.status(200).json({

      success:true,

      ...dashboard

    });


  } catch(error) {


    console.error(
      "Erreur dashboard:",
      error
    );


    res.status(500).json({

      success:false,

      message:"Impossible de charger le dashboard"

    });


  }

};






/* =====================================================
   NOTIFICATIONS
===================================================== */


export const listerNotifications = async (req, res) => {

  try {


    const notifications = await getNotifications();


    res.status(200).json(
      notifications
    );


  } catch (error) {


    console.error(error);


    res.status(500).json({

      error:"Impossible de récupérer les notifications."

    });


  }

};





export const lireNotification = async(req,res)=>{

  try{


    await markAsRead(
      req.params.id
    );


    res.json({

      success:true

    });


  }catch(error){


    res.status(500).json({

      error:error.message

    });


  }


};






export const lireToutesNotifications = async(req,res)=>{


  try{


    await markAllAsRead();


    res.json({

      success:true

    });



  }catch(error){


    res.status(500).json({

      error:error.message

    });


  }


};








/* =====================================================
   ELEVES
===================================================== */


export const inscrireEleve = async (req,res)=>{


  try{


    const data=req.body;



    if(
      !data.nom ||
      !data.post_nom ||
      !data.prenom ||
      !data.annee_scolaire
    ){

      return res.status(400).json({

        error:"Champs obligatoires manquants"

      });

    }




    const eleve = await createEleve(data);



    // notification automatique

    await notifyInscription(eleve);



    res.status(201).json({

      message:"Élève inscrit avec succès",

      eleve

    });



  }catch(err){


    console.error(err);


    res.status(500).json({

      error:"Erreur serveur"

    });


  }


};







export const listerEleves = async(req,res)=>{


  try{


    const eleves = await getEleves();


    res.json(eleves);



  }catch(err){


    console.error(err);


    res.status(500).json({

      error:"Erreur serveur"

    });


  }


};









/* =====================================================
   NIVEAUX
===================================================== */


export const listerNiveaux = async(req,res)=>{


  try{


    const niveaux = await getNiveaux();


    res.json(niveaux);



  }catch(err){


    res.status(500).json({

      error:"Erreur serveur"

    });


  }


};







/* =====================================================
   SECTIONS
===================================================== */


export const listerSections = async(req,res)=>{


  try{


    const sections = await getSections();


    res.json(sections);



  }catch(err){


    res.status(500).json({

      error:"Erreur serveur"

    });


  }


};







/* =====================================================
   CLASSES
===================================================== */


export const listerClasses = async(req,res)=>{


  try{


    const classes = await getClasses();


    res.json(classes);



  }catch(err){


    res.status(500).json({

      error:"Erreur serveur"

    });


  }


};







/* =====================================================
   PARALLELES
===================================================== */


export const listerParalleles = async(req,res)=>{


  try{


    const paralleles = await getParalleles();


    res.json(paralleles);



  }catch(err){


    res.status(500).json({

      error:"Erreur serveur"

    });


  }


};