
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  School,
  CalendarX,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  FileText,
  Bell,
  UserPlus,
  CreditCard
} from "lucide-react";

import { useAuth } from "../../hooks/UseAuth";
import NotificationBell from "../../components/NotificationBell";

export default function Dashboard() {

  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {

    async function fetchDashboard(){

      try {

        const response = await fetch(
          "/dashboard/homepage",
          {
            credentials:"include"
          }
        );


        if(!response.ok){
          throw new Error(
            "Impossible de charger le dashboard"
          );
        }


        const data = await response.json();

        setDashboard(data);


      } catch(err){

        console.error(err);
        setError(err.message);

      } finally {

        setLoading(false);

      }

    }


    fetchDashboard();


  },[]);



  if(loading){

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">

        <div className="text-slate-500">
          Chargement du tableau de bord...
        </div>

      </div>
    );

  }



  if(error){

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-50">

        <div className="bg-white p-6 rounded-xl shadow text-red-600">
          {error}
        </div>

      </div>

    );

  }



  const stats = [

    {
      title:"Élèves",
      value:dashboard?.stats?.studentsCount ?? 0,
      icon:Users,
      color:"bg-blue-50 text-blue-600"
    },


    {
      title:"Enseignants",
      value:dashboard?.stats?.teachersCount ?? 0,
      icon:GraduationCap,
      color:"bg-green-50 text-green-600"
    },


    {
      title:"Classes",
      value:dashboard?.stats?.classesCount ?? 0,
      icon:School,
      color:"bg-purple-50 text-purple-600"
    },


    {
      title:"Absences aujourd'hui",
      value:dashboard?.stats?.absencesCount ?? 0,
      icon:CalendarX,
      color:"bg-red-50 text-red-600"
    }

  ];



  return (

    <div className="
      min-h-screen
      bg-slate-50
      p-4
      sm:p-6
      lg:p-8
    ">


      {/* HEADER */}

      <div className="
        flex
        flex-col
        sm:flex-row
        justify-between
        gap-4
        mb-8
      ">


        <div>

          <h1 className="
            text-3xl
            font-bold
            text-slate-900
          ">

            Bonjour {user?.prenom || "Administrateur"}

          </h1>


          <p className="text-slate-500 mt-2">

            Tableau de bord du Collège Emmanuel

          </p>


        </div>



        <div className="
          flex
          items-center
          gap-3
        ">

          <NotificationBell/>


          <div className="
            bg-white
            border
            rounded-xl
            px-4
            py-2
            flex
            items-center
            gap-2
          ">

            <Calendar size={16}/>

            <span className="text-sm">

              {new Date().toLocaleDateString(
                "fr-FR",
                {
                  weekday:"long",
                  day:"numeric",
                  month:"long"
                }
              )}

            </span>

          </div>


        </div>


      </div>





      {/* STATISTIQUES */}


      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-5
        mb-8
      ">


        {
          stats.map((item)=>{

            const Icon=item.icon;


            return (

              <div
                key={item.title}
                className="
                  bg-white
                  rounded-xl
                  shadow-sm
                  border
                  p-5
                  flex
                  justify-between
                  items-center
                  hover:shadow-md
                  transition
                "
              >


                <div>

                  <p className="
                    text-xs
                    uppercase
                    text-slate-500
                    font-semibold
                  ">

                    {item.title}

                  </p>


                  <h2 className="
                    text-3xl
                    font-bold
                    mt-2
                  ">

                    {item.value}

                  </h2>


                </div>



                <div className={`
                  p-4
                  rounded-xl
                  ${item.color}
                `}>

                  <Icon size={26}/>

                </div>


              </div>


            )

          })

        }


      </div>





      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
      ">



        {/* PERFORMANCE */}


        <section className="
          bg-white
          rounded-xl
          border
          p-6
          lg:col-span-2
        ">


          <div className="
            flex
            justify-between
            mb-5
          ">


            <h2 className="
              font-bold
              flex
              items-center
              gap-2
            ">

              <TrendingUp size={20}
              className="text-indigo-600"/>

              Performances générales

            </h2>



            <Link
              to="/dashboard/reports"
              className="
              text-indigo-600
              text-sm
              flex
              items-center
              gap-1
              "
            >

              Rapports
              <ArrowUpRight size={14}/>

            </Link>


          </div>




          <div className="
            h-48
            bg-indigo-50
            rounded-xl
            flex
            items-center
            justify-center
            text-slate-400
          ">

            <FileText size={40}/>

            <span className="ml-3">
              Graphique des performances
            </span>

          </div>




          <div className="
            grid
            sm:grid-cols-3
            gap-3
            mt-6
          ">


            <Link
              to="/dashboard/inscriptions"
              className="
              bg-indigo-600
              text-white
              rounded-lg
              p-3
              text-center
              "
            >

              <UserPlus size={18}
              className="inline mr-2"/>

              Inscription

            </Link>



            <Link
              to="/dashboard/paiements"
              className="
              bg-green-600
              text-white
              rounded-lg
              p-3
              text-center
              "
            >

              <CreditCard size={18}
              className="inline mr-2"/>

              Paiement

            </Link>



            <Link
              to="/dashboard/personnel"
              className="
              bg-slate-200
              rounded-lg
              p-3
              text-center
              "
            >

              Personnel

            </Link>


          </div>


        </section>





        {/* DROITE */}


        <aside className="
          bg-white
          rounded-xl
          border
          p-6
        ">


          <h3 className="
            font-bold
            mb-4
            flex
            items-center
            gap-2
          ">

            <Bell size={18}/>

            Notifications

          </h3>



          <div className="space-y-3">


          {
            dashboard?.notifications?.length ?

            dashboard.notifications
            .slice(0,5)
            .map((n)=>(

              <div
              key={n.notification_id}
              className="
              bg-slate-50
              rounded-lg
              p-3
              "
              >

                <p className="font-medium text-sm">

                  {n.titre}

                </p>


                <p className="text-xs text-slate-500">

                  {n.message}

                </p>


              </div>


            ))

            :

            <p className="text-sm text-slate-400">
              Aucune notification
            </p>

          }


          </div>




          <h3 className="
            font-bold
            mt-6
            mb-3
          ">

            Derniers élèves

          </h3>



          {
            dashboard?.recentStudents?.map(student=>(

              <div
              key={student.id}
              className="
              bg-slate-50
              rounded-lg
              p-3
              mb-2
              "
              >

                <p className="font-medium">

                  {student.firstname} {student.lastname}

                </p>


                <p className="text-xs text-slate-500">

                  {student.class_name}

                </p>


              </div>


            ))
          }



        </aside>



      </div>


    </div>

  );

}
