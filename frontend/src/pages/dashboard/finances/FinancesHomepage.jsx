import { useEffect, useState } from "react";
import {
  CreditCard,
  Wallet,
  Receipt,
  Banknote,
} from "lucide-react";

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [finance, setFinance] = useState(null);

  useEffect(() => {
    chargerDashboard();
  }, []);

  async function chargerDashboard() {
    try {
      const res = await fetch("/finance/homepage");

      const data = await res.json();

      if (data.success) {
        setFinance(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="text-center py-20">Chargement...</p>;

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Finance
        </h1>

        <p className="text-slate-500">
          Tableau de bord financier
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Card
          icon={<Wallet />}
          title="Recettes du jour"
          value={`${finance.recettesJour} FC`}
        />

        <Card
          icon={<Banknote />}
          title="Recettes du mois"
          value={`${finance.recettesMois} FC`}
        />

        <Card
          icon={<CreditCard />}
          title="Paiements"
          value={finance.nombrePaiements}
        />

        <Card
          icon={<Receipt />}
          title="Prochain reçu"
          value={finance.prochainNumeroRecu}
        />

      </div>

      <div className="rounded-3xl bg-white shadow">

        <div className="border-b px-6 py-5">

          <h2 className="text-lg font-semibold">
            Derniers paiements
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="p-4 text-left">Reçu</th>

              <th className="p-4 text-left">Élève</th>

              <th className="p-4 text-left">Montant</th>

              <th className="p-4 text-left">Date</th>

            </tr>

          </thead>

          <tbody>

            {finance.derniersPaiements.map((p) => (

              <tr key={p.id}>

                <td className="p-4">{p.numero_recu}</td>

                <td className="p-4">{p.eleve}</td>

                <td className="p-4">{p.montant} FC</td>

                <td className="p-4">{p.date}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div className="rounded-3xl bg-white shadow p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-600">
          {icon}
        </div>

      </div>

    </div>
  );
}