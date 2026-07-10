import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/UseAuth";

const initialLoginForm = {
  usernameOrEmail: "",
  password: "",
};

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState(initialLoginForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");



  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!form.usernameOrEmail || !form.password) {
      toast.warning("Veuillez remplir tous les champs.");
      return;
    }


    if (isSubmitting) return;


    setIsSubmitting(true);
    setError("");



    try {

      const response = await fetch("/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: form.usernameOrEmail,
          password: form.password,
        }),

      });



      const data = await response.json();



      if (!response.ok || !data.success) {

        throw new Error(
          data.message || "Identifiants incorrects."
        );

      }



      login(data.token, data.user);



      toast.success(
        `Bienvenue ${data.user.firstname || "dans votre espace"} 🎓`
      );



      navigate("/dashboard");



    } catch (error) {

      setError(error.message);
      toast.error(error.message);


    } finally {

      setIsSubmitting(false);

    }

  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-5">


      <div className="grid lg:grid-cols-2 max-w-5xl w-full bg-white rounded-[2rem] shadow-xl overflow-hidden">



        {/* LOGIN */}

        <section className="p-8 lg:p-12">


          <div className="mb-8">


            <p className="text-sm uppercase tracking-widest text-blue-600 font-bold">
              Espace scolaire
            </p>


            <h1 className="text-3xl font-bold text-slate-900 mt-3">
              Connexion
            </h1>


            <p className="text-slate-500 mt-3">
              Connectez-vous à votre compte d'administration.
            </p>


          </div>




          {error && (

            <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-5">

              {error}

            </div>

          )}





          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >




            <div>

              <label className="text-sm font-medium text-slate-700">

                Email ou identifiant

              </label>


              <input

                type="text"

                name="usernameOrEmail"

                value={form.usernameOrEmail}

                onChange={handleChange}

                placeholder="ex: jean@gmail.com"
                required

                className="mt-2 w-full rounded-2xl border px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"

              />

            </div>





            <div>


              <label className="text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <div className="relative">


                <input

                  type={showPassword ? "text" : "password"}

                  name="password"

                  value={form.password}

                  onChange={handleChange}

                  placeholder="Votre mot de passe"
                  required

                  className="mt-2 w-full rounded-2xl border px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"

                />



                <button

                  type="button"

                  onClick={() =>
                    setShowPassword(!showPassword)
                  }

                  className="absolute right-4 top-5 text-sm text-blue-600"

                >

                  {showPassword ? "Cacher" : "Voir"}

                </button>


              </div>


            </div>





            <button

              disabled={isSubmitting}

              className="w-full rounded-full bg-blue-700 text-white py-3 font-semibold hover:bg-blue-800 transition disabled:opacity-50"

            >

              {isSubmitting
                ? "Connexion..."
                : "Se connecter"
              }


            </button>



          </form>



        </section>





        {/* PRESENTATION ECOLE */}

        <section className="bg-blue-900 text-white p-8 lg:p-12">


          <h2 className="text-3xl font-bold">

            Collège Emmanuel 🎓

          </h2>



          <p className="mt-5 text-blue-100 leading-7">

            Votre plateforme numérique de gestion scolaire.
            Accédez aux informations académiques,
            aux cours, aux notes et aux communications.

          </p>





          <div className="mt-8 space-y-4">


            <div className="bg-white/10 rounded-2xl p-5">

              📚 <strong>Élèves</strong>

              <p className="text-blue-100 mt-2">
                Consultation des notes, horaires et devoirs.
              </p>

            </div>




            <div className="bg-white/10 rounded-2xl p-5">

              👨‍🏫 <strong>Enseignants</strong>

              <p className="text-blue-100 mt-2">
                Gestion des cours, présences et évaluations.
              </p>

            </div>





            <div className="bg-white/10 rounded-2xl p-5">

              🔐 <strong>Administration</strong>

              <p className="text-blue-100 mt-2">
                Gestion des utilisateurs et paramètres scolaires.
              </p>

            </div>



          </div>


        </section>



      </div>


    </div>

  );

}