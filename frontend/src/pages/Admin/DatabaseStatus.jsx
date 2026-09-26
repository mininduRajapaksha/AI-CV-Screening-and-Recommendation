import {
  Activity,
  CheckCircle2,
  Clock3,
  HardDrive,
} from "lucide-react";

const databaseMetrics = [
  {
    label: "Connection status",
    value: "Connected",
    icon: CheckCircle2,
    valueClass: "text-emerald-600",
    iconBg: "#ECFDF5",
    iconColor: "text-emerald-600",
  },
  {
    label: "Response time",
    value: "42 ms",
    icon: Clock3,
    iconBg: "#EEF2FF",
    iconColor: "text-[#4338CA]",
  },
  {
    label: "Storage used",
    value: "10 MB / 512 MB",
    icon: HardDrive,
    iconBg: "#F5F3FF",
    iconColor: "text-[#7C3AED]",
  },
  {
    label: "Active connections",
    value: "6 / 100",
    icon: Activity,
    iconBg: "#EFF6FF",
    iconColor: "text-[#3B82F6]",
  },
];

const collections = [
  { name: "users", documents: "10", size: "50 KB" },
  { name: "jobpostings", documents: "22", size: "120 KB" },
  { name: "candidated", documents: "326", size: "3.2 MB" },
  { name: "evaluationresults", documents: "326", size: "4.5 MB" },
];

export default function DatabaseStatus() {
  return (
    <div className="w-full pb-8 text-slate-950">
        {/*Header*/}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold leading-9">Database status</h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor database connection and performance
        </p>
      </div>

        {/*Status cards*/}
      <section className="mb-9 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {databaseMetrics.map(({ label, value, icon: Icon, valueClass = "text-slate-950", iconBg, iconColor }) => (
          <article
            key={label}
            className="h-[127px] rounded-[14px] bg-white px-[18px] py-[17px] shadow-sm"
          >
            <div className="flex items-center gap-2.5 text-sm text-slate-900">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: iconBg }}
              >
                <Icon size={17} strokeWidth={2} className={iconColor} />
              </div>
              <span>{label}</span>
            </div>
            <p className={`mt-8 text-xl font-medium ${valueClass}`}>{value}</p>
          </article>
        ))}
      </section>

        {/*DB Connection details*/}
      <section className="mb-8 rounded-[14px] bg-white px-9 py-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-medium">Connection details</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-600">
            <CheckCircle2 size={18} strokeWidth={2.25} />
            Healthy
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Detail label="Host" value="cluster0.mongodb.net" />
          <Detail label="Database name" value="AI_CV_recommend_db" />
          <Detail label="Driver" value="Mongoose 8.2" />
          <Detail label="Last downtime" value="none" />
        </dl>
      </section>

        {/*Database collections*/}
      <section className="rounded-[14px] bg-white px-9 py-7 shadow-sm">
        <h2 className="text-base font-medium">Collections</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead className="border-b border-slate-200 text-left text-slate-400">
              <tr>
                <th className="px-6 pb-2 font-medium">Collection</th>
                <th className="px-6 pb-2 text-center font-medium">Documents</th>
                <th className="px-6 pb-2 text-right font-medium">Size</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr key={collection.name} className="border-b border-slate-200 last:border-b-0">
                  <td className="px-6 py-3.5">{collection.name}</td>
                  <td className="px-6 py-3.5 text-center">{collection.documents}</td>
                  <td className="px-6 py-3.5 text-right">{collection.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="mt-2 text-sm text-slate-900">{value}</dd>
    </div>
  );
}