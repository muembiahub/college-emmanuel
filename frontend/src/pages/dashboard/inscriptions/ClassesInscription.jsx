import { BookOpen, Users2 } from "lucide-react";

export default function ClassesInscription() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Classes et affectations</h1>
            <p className="text-sm text-slate-500">Organisation des élèves par classe et niveau.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { name: "Maternelle", count: "34 élèves", color: "bg-sky-100 text-sky-700" },
          { name: "Primaire", count: "88 élèves", color: "bg-violet-100 text-violet-700" },
          { name: "Secondaire", count: "72 élèves", color: "bg-amber-100 text-amber-700" }
        ].map((item) => (
          <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`inline-flex rounded-full p-2 ${item.color}`}>
              <Users2 size={18} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-800">{item.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
