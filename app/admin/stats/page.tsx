import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { AdminNav } from "components/admin/AdminNav";
import { getAdminStats } from "lib/db/stats";

export default async function AdminStatsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/login?callbackUrl=/admin/stats");
  }

  const stats = await getAdminStats();

  const maxSales = Math.max(...stats.fakeSales.map((s) => s.amount), 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
      <header className="mb-6 space-y-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
          Admin
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Overview &amp; health
        </h1>
        <p className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
          High-level snapshot of Hamdi Shop usage, ratings, and simulated sales
          performance.
        </p>
      </header>

      <AdminNav />

      <div className="mt-4 grid gap-6 md:grid-cols-3">
        <StatCard label="Total users" value={stats.userCount.toString()} />
        <StatCard label="Total products" value={stats.productCount.toString()} />
        <StatCard label="Total comments" value={stats.commentCount.toString()} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <section className="rounded-2xl border border-neutral-200 bg-white/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950/80">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Simulated monthly sales
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Demo-only numbers
            </p>
          </div>
          <div className="flex items-end gap-3">
            {stats.fakeSales.map((entry) => {
              const height = (entry.amount / maxSales) * 100;
              return (
                <div
                  key={entry.month}
                  className="flex flex-1 flex-col items-center gap-1 text-xs"
                >
                  <div className="flex h-32 w-full items-end rounded-t-lg bg-neutral-100 dark:bg-neutral-900">
                    <div
                      className="w-full rounded-t-lg bg-black/80 dark:bg-white/80"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[0.7rem] text-neutral-500 dark:text-neutral-400">
                    {entry.month}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950/80">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Ratings summary
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Average rating across all products:
          </p>
          <p className="text-3xl font-semibold tracking-tight">
            {stats.avgRating ? stats.avgRating.toFixed(1) : "–"}
            <span className="ml-1 text-base text-neutral-500 dark:text-neutral-400">
              / 5
            </span>
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            This aggregates all user-submitted ratings. Use it to gauge overall product
            satisfaction at a glance.
          </p>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

