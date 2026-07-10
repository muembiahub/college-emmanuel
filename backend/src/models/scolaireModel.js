import { supabase } from "../config/database.js";


/* =====================================================
   DASHBOARD HOME
===================================================== */


/**
 * Récupérer les statistiques du dashboard
 */
export const getDashboardStats = async () => {


  const [
    eleves,
    classes,
    niveaux,
    sections
  ] = await Promise.all([


    supabase
      .from("eleves")
      .select("*", {
        count: "exact",
        head: true
      }),


    supabase
      .from("classes")
      .select("*", {
        count: "exact",
        head: true
      }),


    supabase
      .from("niveaux")
      .select("*", {
        count: "exact",
        head: true
      }),


    supabase
      .from("sections")
      .select("*", {
        count: "exact",
        head: true
      })

  ]);



  if (eleves.error) throw eleves.error;
  if (classes.error) throw classes.error;
  if (niveaux.error) throw niveaux.error;
  if (sections.error) throw sections.error;



  return {

    studentsCount: eleves.count || 0,

    classesCount: classes.count || 0,

    niveauxCount: niveaux.count || 0,

    sectionsCount: sections.count || 0

  };

};






/**
 * Derniers élèves inscrits
 */
export const getRecentEleves = async () => {


  const {
    data,
    error
  } = await supabase

    .from("vue_eleves_complet")

    .select("*")

    .order("created_at", {
      ascending:false
    })

    .limit(5);



  if(error) throw error;


  return data;


};






/**
 * Toutes les notifications
 */
export const getNotifications = async () => {


  const {
    data,
    error
  } = await supabase

    .from("notifications")

    .select("*")

    .order("created_at", {
      ascending:false
    });



  if(error) throw error;


  return data;


};






/**
 * Données complètes du dashboard
 */
export const getDashboardHome = async () => {


  const [
    stats,
    recentStudents,
    notifications
  ] = await Promise.all([


    getDashboardStats(),

    getRecentEleves(),

    getNotifications()


  ]);



  return {


    stats,

    recentStudents,

    notifications


  };


};






/* =====================================================
   NIVEAUX
===================================================== */


export const getNiveaux = async () => {


  const {
    data,
    error
  } = await supabase

    .from("niveaux")

    .select("*");



  if(error) throw error;


  return data;


};






/* =====================================================
   SECTIONS
===================================================== */


export const getSections = async () => {


  const {
    data,
    error
  } = await supabase

    .from("sections")

    .select("*");



  if(error) throw error;


  return data;


};






/* =====================================================
   CLASSES
===================================================== */


export const getClasses = async () => {


  const {
    data,
    error
  } = await supabase

    .from("classes")

    .select("*");



  if(error) throw error;


  return data;


};






/* =====================================================
   PARALLELES
===================================================== */


export const getParalleles = async () => {


  const {
    data,
    error
  } = await supabase

    .from("paralleles")

    .select("*");



  if(error) throw error;


  return data;


};






/* =====================================================
   ELEVES
===================================================== */


/**
 * Créer un élève
 */
export const createEleve = async (student) => {


  const {
    data,
    error
  } = await supabase

    .from("eleves")

    .insert([student])

    .select();



  if(error) throw error;


  return data[0];


};






/**
 * Récupérer tous les élèves
 */
export const getEleves = async () => {


  const {
    data,
    error
  } = await supabase

    .from("vue_eleves_complet")

    .select("*");



  if(error) throw error;


  return data;


};






/* =====================================================
   NOTIFICATIONS
===================================================== */


/**
 * Créer notification
 */
export const createNotification = async (notification) => {


  const {
    data,
    error
  } = await supabase

    .from("notifications")

    .insert([notification])

    .select()

    .single();



  if(error) throw error;


  return data;


};






/**
 * Marquer une notification comme lue
 */
export const markAsRead = async (id) => {


  const {
    data,
    error
  } = await supabase

    .from("notifications")

    .update({
      lu:true
    })

    .eq(
      "notification_id",
      Number(id)
    )

    .select();



  console.log("Notification:", data);


  if(error) throw error;


};






/**
 * Marquer toutes les notifications comme lues
 */
export const markAllAsRead = async () => {


  const {
    error
  } = await supabase

    .from("notifications")

    .update({
      lu:true
    })

    .eq(
      "lu",
      false
    );



  if(error) throw error;


};
