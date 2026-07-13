import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, LabelList } from "recharts";

const COLORS = [
  "#2563eb", // blue-600
  "#3b82f6", // blue-500
  "#60a5fa", // blue-400
  "#818cf8", // indigo-400
  "#7c3aed", // violet-600
  "#06b6d4", // cyan-500
  "#14b8a6", // teal-500
  "#10b981", // emerald-500
  "#22c55e", // green-500
  "#f59e0b", // amber-500
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="bg-white rounded-xl shadow-xl border p-4 min-w-[240px]">
      <h3 className="font-bold text-lg text-slate-800">
        {item.nom_classe}
      </h3>
      <div className="mt-3 space-y-1 text-sm">
        <p>
          <span className="font-semibold">
            Section :
          </span>{" "}
          {item.nom_section}
        </p>
        {item.nom_option && (
          <p>
            <span className="font-semibold">
              Option :
            </span>{" "}
            {item.nom_option}
          </p>
        )}
        {item.nom_parallele && (
          <p>
            <span className="font-semibold">
              Parallèle :
            </span>{" "}
            {item.nom_parallele}
          </p>
        )}
      </div>
      <div className="mt-4 border-t pt-3">
        <p className="text-indigo-600 font-bold text-lg">
          {item.total_eleves} élève{item.total_eleves > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

export default function StudentsByClassChart({
  data = [],
}) {
  const totalStudents = data.reduce(
    (sum, item) => sum + item.total_eleves,
    0
  );

  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border p-10 text-center">
        <h2 className="text-2xl font-bold">
          Répartition des élèves
        </h2>
        <p className="text-slate-500 mt-3">
          Aucune statistique disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Répartition des élèves par classe
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Total : {totalStudents} élèves dans {data.length} classes
          </p>
        </div>
      </div>

      <ResponsiveContainer
        width="100%"
        height={420}
      >
        <BarChart
          data={data}
          margin={{
            top: 30,
            right: 30,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e0e0e0"
          />
          <XAxis
  dataKey="nom_classe"
  tickFormatter={(value, index) => {
    const item = data[index];

    return `${item.nom_classe}${
      item.nom_parallele ? " " + item.nom_parallele : ""
    }`;
  }}
/>
          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 12,
              fill: "#64748b", // slate-500
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "rgba(0, 0, 0, 0.05)"
            }}
          />
          <Bar
            dataKey="total_eleves"
            radius={[10, 10, 0, 0]}
            animationDuration={800}
            barSize={40}
          >
            <LabelList
              dataKey="total_eleves"
              position="top"
              style={{
                fontWeight: "bold",
                fontSize: 13,
                fill: "#334155", // slate-700
              }}
            />
            {data.map((item, index) => (
              <Cell
                key={`cell-${item.classe_id}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        {data.map((item, index) => (
          <div
            key={item.classe_id}
            className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <h3
                className="font-bold text-lg"
                style={{
                  color:
                    COLORS[index % COLORS.length],
                }}
              >
                {item.nom_classe}
              </h3>
              <span className="text-2xl font-extrabold text-slate-800">
                {item.total_eleves}
              </span>
            </div>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>
                <strong className="font-semibold">Section :</strong>{" "}
                {item.nom_section}
              </p>
              {item.nom_option && (
                <p>
                  <strong className="font-semibold">Option :</strong>{" "}
                  {item.nom_option}
                </p>
              )}
              {item.nom_parallele && (
                <p>
                  <strong className="font-semibold">Parallèle :</strong>{" "}
                  {item.nom_parallele}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
