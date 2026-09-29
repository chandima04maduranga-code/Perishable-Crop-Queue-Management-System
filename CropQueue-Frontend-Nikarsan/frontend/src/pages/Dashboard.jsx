import { Link } from "react-router-dom";
import useResource from "../hooks/useResource.js";
import { readData } from "../services/api.js";
import { amount, formatDate } from "../utils/format.js";
import StatCard from "../components/StatCard.jsx";
import Icon from "../components/Icon.jsx";
import CropIcon from "../components/CropIcon.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  CROP_ROLES,
  DISTRIBUTION_ROLES,
  hasRole,
} from "../utils/permissions.js";
import {
  BatchDetails,
  EmptyState,
  PageHeading,
  ResourceState,
  StatusBadge,
} from "../components/Shared.jsx";

async function loadDashboard(signal) {
  const [stats, next, crops] = await Promise.all([
    readData("/dashboard", signal),
    readData("/crops/next", signal),
    readData("/crops", signal),
  ]);
  return { stats, next, crops };
}

export default function Dashboard() {
  const { user } = useAuth();
  const canManage = hasRole(user, CROP_ROLES);
  const canDistribute = hasRole(user, DISTRIBUTION_ROLES);
  const { data, loading, error, reload } = useResource(loadDashboard);
  const upcoming =
    data?.crops
      .filter(
        (crop) => crop.status === "AVAILABLE" && Number(crop.quantity) > 0,
      )
      .slice(0, 5) || [];
  const metric = (name, unit = "") =>
    data ? `${amount(data.stats[name])}${unit}` : "—";

  return (
    <>
      <PageHeading
        hero
        eyebrow="FRESH HARVESTS. BETTER TOMORROWS."
        title="Farm overview"
        description="Manage your crop batches, track stock and plan the next distribution."
      >
        <button
          className="button secondary"
          onClick={reload}
          disabled={loading}
        >
          <Icon name="refresh" size={18} />
          Refresh
        </button>
        {canManage ? (
          <Link className="button primary" to="/crops/add">
            <Icon name="plus" size={21} />
            Add crop batch
          </Link>
        ) : canDistribute ? (
          <Link className="button primary" to="/distribution">
            <Icon name="truck" size={21} />
            Distribute crops
          </Link>
        ) : (
          <Link className="button primary" to="/register">
            <Icon name="users" size={21} />
            Join the community
          </Link>
        )}
      </PageHeading>
      <div className="stats-grid" aria-busy={loading}>
        <StatCard
          title="Total batches"
          value={metric("totalBatches")}
          description="All registered crop batches"
          tone="blue"
          icon="layers"
        />
        <StatCard
          title="Available stock"
          value={metric("availableQuantity", " kg")}
          description="Stock available in batches"
          tone="green"
          icon="leaf"
          to="/crops?status=AVAILABLE"
        />
        <StatCard
          title="Near expiry"
          value={metric("nearExpiryBatches")}
          description="Expiry today or in the next 3 days"
          tone="amber"
          icon="alert"
          to="/crops?filter=expiring"
        />
        <StatCard
          title="Fully distributed"
          value={metric("distributedBatches")}
          description="Batches with no remaining stock"
          tone="purple"
          icon="box"
          to="/crops?status=DISTRIBUTED"
        />
      </div>
      <ResourceState loading={loading} error={error} retry={reload} />
      {data && (
        <div className="dashboard-grid">
          <section className="panel next-panel dashboard-next">
            <div className="section-heading">
              <div className="section-title">
                <span className="section-icon green">
                  <Icon name="list" />
                </span>
                <h2>Next in the FIFO queue</h2>
              </div>
              <Link className="inline-link" to="/distribution">
                View queue
                <Icon name="arrow" size={17} />
              </Link>
            </div>
            {data.next ? (
              <div className="next-content">
                <div className="harvest-showcase">
                  <img
                    src={`${import.meta.env.BASE_URL}images/sri-lanka-harvest-crate.png`}
                    alt=""
                    width="180"
                    height="160"
                  />
                  <span className="next-label">
                    <span />
                    OLDEST HARVEST FIRST
                  </span>
                </div>
                <div className="next-crop-title">
                  <CropIcon name={data.next.crop_name} />
                  <div>
                    <span>READY FOR DISTRIBUTION</span>
                    <h3 className="crop-title">{data.next.crop_name}</h3>
                  </div>
                </div>
                <BatchDetails crop={data.next} />
                <Link className="button primary stretch" to="/distribution">
                  <Icon name="truck" size={21} />
                  {canDistribute
                    ? "Distribute this batch"
                    : "View FIFO details"}
                  <Icon name="arrow" size={18} />
                </Link>
              </div>
            ) : (
              <div className="next-empty">
                <EmptyState title="Your queue is clear">
                  <p>
                    No batches in the FIFO queue yet.
                    <br />
                    {canManage
                      ? "Add a crop batch to start managing your harvest."
                      : "Available harvests will appear here when a Farm Manager adds them."}
                  </p>
                  {canManage && (
                    <Link className="button primary" to="/crops/add">
                      <Icon name="plus" />
                      Add a batch
                    </Link>
                  )}
                </EmptyState>
              </div>
            )}
          </section>
          <section className="panel queue-overview">
            <div className="section-heading">
              <div className="section-title">
                <span className="section-icon amber">
                  <Icon name="calendar" />
                </span>
                <div>
                  <h2>Upcoming batches</h2>
                  <p>Batches ordered by harvest date, oldest first.</p>
                </div>
              </div>
              <Link className="inline-link" to="/crops">
                View all
                <Icon name="arrow" size={17} />
              </Link>
            </div>
            {upcoming.length ? (
              <div className="table-scroll upcoming-table">
                <table>
                  <caption className="sr-only">Upcoming crop batches</caption>
                  <thead>
                    <tr>
                      <th>Batch ID</th>
                      <th>Crop</th>
                      <th>Harvest date</th>
                      <th>Expiry date</th>
                      <th>Remaining</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map((crop) => (
                      <tr key={crop.id}>
                        <td>
                          <strong>#{crop.id}</strong>
                        </td>
                        <td>
                          <div className="crop-cell">
                            <CropIcon name={crop.crop_name} />
                            <strong>{crop.crop_name}</strong>
                          </div>
                        </td>
                        <td className="nowrap">
                          {formatDate(crop.harvest_date)}
                        </td>
                        <td className="nowrap">
                          {formatDate(crop.expiry_date)}
                        </td>
                        <td className="nowrap stock-cell">
                          {amount(crop.quantity)} kg
                        </td>
                        <td>
                          <StatusBadge
                            status={crop.status}
                            expiry={crop.expiry_date}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No available batches">
                <p>Your available crop batches will appear here.</p>
              </EmptyState>
            )}
            <div className="queue-tip">
              <span className="tip-icon">
                <Icon name="sprout" size={28} />
              </span>
              <div>
                <strong>A little care. A lot less waste.</strong>
                <p>
                  Distribute older harvests first. Check expiry dates regularly
                  to keep your produce moving while it is fresh.
                </p>
              </div>
            </div>
            <div className="panel-flourish" aria-hidden="true">
              <svg viewBox="0 0 600 65" preserveAspectRatio="none">
                <path
                  d="M0 55C120 16 154 70 332 28S489 38 600 0v65H0Z"
                  fill="#def5d7"
                />
                <path d="M0 62C160 39 349 62 600 25v40H0Z" fill="#b9e9ae" />
              </svg>
              <Icon name="sprout" size={68} />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
