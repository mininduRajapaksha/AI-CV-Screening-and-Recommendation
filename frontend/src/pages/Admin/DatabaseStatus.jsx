import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  HardDrive,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function DatabaseStatus() {
  const [database, setDatabase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDatabaseStatus();

    const interval = setInterval(() => {
      fetchDatabaseStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchDatabaseStatus = async () => {
    try {
      setError("");

      const token = localStorage.getItem("cvision_token");

      const response = await fetch(
        `${API_BASE_URL}/admin/database-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load database status"
        );
      }

      setDatabase(data.database);
    } catch (error) {
      console.error("Database status error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !database) {
    return (
      <div className="w-full pb-8 text-slate-950">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold leading-9">
            Database status
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor database connection and performance
          </p>
        </div>

        <div className="rounded-[14px] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <RefreshCw
              size={20}
              className="animate-spin text-[#4338CA]"
            />

            <p className="text-sm text-slate-500">
              Loading database information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !database) {
    return (
      <div className="w-full pb-8 text-slate-950">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold leading-9">
            Database status
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor database connection and performance
          </p>
        </div>

        <div className="rounded-[14px] bg-white p-8 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
              <AlertCircle
                size={20}
                className="text-red-600"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-red-600">
                Failed to load database status
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>

              <button
                onClick={fetchDatabaseStatus}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1E2A4A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#263556]"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isConnected =
    database?.connectionStatus === "Connected";

  const databaseMetrics = [
    {
      label: "Connection status",
      value: database?.connectionStatus || "Unknown",
      icon: CheckCircle2,
      valueClass: isConnected
        ? "text-emerald-600"
        : "text-red-600",
      iconBg: isConnected ? "#ECFDF5" : "#FEF2F2",
      iconColor: isConnected
        ? "text-emerald-600"
        : "text-red-600",
    },
    {
      label: "Response time",
      value: database?.responseTime || "Unavailable",
      icon: Clock3,
      iconBg: "#EEF2FF",
      iconColor: "text-[#4338CA]",
    },
    {
      label: "Storage used",
      value: database?.storage?.used || "Unavailable",
      icon: HardDrive,
      iconBg: "#F5F3FF",
      iconColor: "text-[#7C3AED]",
    },
    {
      label: "Active connections",
      value:
        database?.connections?.current !== null &&
        database?.connections?.current !== undefined
          ? database.connections.current
          : "Unavailable",
      icon: Activity,
      iconBg: "#EFF6FF",
      iconColor: "text-[#3B82F6]",
    },
  ];

  return (
    <div className="w-full pb-8 text-slate-950">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold leading-9">
            Database status
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor database connection and performance
          </p>
        </div>

        <button
          onClick={fetchDatabaseStatus}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Background refresh error */}
      {error && database && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertCircle size={17} />
          <span>
            Unable to refresh database information. Showing the
            last successful data.
          </span>
        </div>
      )}

      {/* Status cards */}
      <section className="mb-9 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {databaseMetrics.map(
          ({
            label,
            value,
            icon: Icon,
            valueClass = "text-slate-950",
            iconBg,
            iconColor,
          }) => (
            <article
              key={label}
              className="h-[127px] rounded-[14px] bg-white px-[18px] py-[17px] shadow-sm"
            >
              <div className="flex items-center gap-2.5 text-sm text-slate-900">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon
                    size={17}
                    strokeWidth={2}
                    className={iconColor}
                  />
                </div>

                <span>{label}</span>
              </div>

              <p
                className={`mt-8 text-xl font-medium ${valueClass}`}
              >
                {value}
              </p>
            </article>
          )
        )}
      </section>

      {/* DB Connection details */}
      <section className="mb-8 rounded-[14px] bg-white px-9 py-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-medium">
            Connection details
          </h2>

          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-600">
              <CheckCircle2
                size={18}
                strokeWidth={2.25}
              />
              Healthy
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm text-red-600">
              <AlertCircle
                size={18}
                strokeWidth={2.25}
              />
              Unhealthy
            </span>
          )}
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Detail
            label="Host"
            value={database?.host || "Unavailable"}
          />

          <Detail
            label="Database name"
            value={
              database?.databaseName || "Unavailable"
            }
          />

          <Detail
            label="Driver"
            value={database?.driver || "Unavailable"}
          />

          <Detail
            label="Last downtime"
            value="Not tracked"
          />
        </dl>
      </section>

      {/* Database collections */}
      <section className="rounded-[14px] bg-white px-9 py-7 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-medium">
            Collections
          </h2>

          <span className="text-sm text-slate-400">
            {database?.collections?.length || 0} collections
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead className="border-b border-slate-200 text-left text-slate-400">
              <tr>
                <th className="px-6 pb-2 font-medium">
                  Collection
                </th>

                <th className="px-6 pb-2 text-center font-medium">
                  Documents
                </th>

                <th className="px-6 pb-2 text-right font-medium">
                  Size
                </th>
              </tr>
            </thead>

            <tbody>
              {database?.collections?.length > 0 ? (
                database.collections.map((collection) => (
                  <tr
                    key={collection.name}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    <td className="px-6 py-3.5">
                      {collection.name}
                    </td>

                    <td className="px-6 py-3.5 text-center">
                      {collection.documents}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      {collection.size}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-sm text-slate-400"
                  >
                    No collections found
                  </td>
                </tr>
              )}
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
      <dt className="text-sm text-slate-400">
        {label}
      </dt>

      <dd className="mt-2 break-all text-sm text-slate-900">
        {value}
      </dd>
    </div>
  );
}