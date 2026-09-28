import { Link } from "react-router-dom";
import useResource from "../hooks/useResource.js";
import { readData } from "../services/api.js";
import { amount, formatDate } from "../utils/format.js";
import StatCard from "../components/StatCard.jsx";
import {
  BatchDetails,
  EmptyState,
  ExpiryDate,
  PageHeading,
  ResourceState,
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
  const { data, loading, error, reload } = useResource(loadDashboard);
  return (
    <>
      <PageHeading
        eyebrow="YOUR HARVEST, IN ORDER"
        title="Farm overview"
        description="A clear view of your batches, stock and next distribution."
      >
        <button
          className="button secondary"
          onClick={reload}
          disabled={loading}
        >
          Refresh
        </button>
        <Link className="button primary" to="/crops/add">
          + Add crop batch
        </Link>
      </PageHeading>
      <ResourceState loading={loading} error={error} retry={reload} />
      {data && (
        <>
          <div className="stats-grid">
            <StatCard
              title="Total batches"
              value={amount(data.stats.totalBatches)}
              description="All registered crop batches"
            />
            <StatCard
              title="Available stock"
              value={`${amount(data.stats.availableQuantity)} kg`}
              description="Remaining stock in available batches"
              tone="green"
            />
            <StatCard
              title="Near expiry"
              value={amount(data.stats.nearExpiryBatches)}
              description="Expiry today through the next 3 days"
              tone="amber"
            />
            <StatCard
              title="Fully distributed"
              value={amount(data.stats.distributedBatches)}
              description="Batches with no remaining stock"
            />
          </div>
          <div className="dashboard-grid">
            <section className="panel next-panel">
              <p className="eyebrow">NEXT IN THE FIFO QUEUE</p>
              {data.next ? (
                <>
                  <h2 className="crop-title">{data.next.crop_name}</h2>
                  <BatchDetails crop={data.next} />
                  <Link className="button primary stretch" to="/distribution">
                    Open distribution queue <span aria-hidden="true">→</span>
                  </Link>
                </>
              ) : (
                <EmptyState title="Your queue is clear">
                  <p>Add a crop batch to start managing your harvest.</p>
                  <Link className="button primary" to="/crops/add">
                    Add a batch
                  </Link>
                </EmptyState>
              )}
            </section>
            <section className="panel queue-overview">
              <div className="section-heading">
                <div>
                  <h2>Upcoming batches</h2>
                  <p>Oldest harvest date first, then batch ID.</p>
                </div>
                <Link to="/crops">View all</Link>
              </div>
              {data.crops.some(
                (crop) =>
                  crop.status === "AVAILABLE" && Number(crop.quantity) > 0,
              ) ? (
                <div className="compact-list">
                  {data.crops
                    .filter(
                      (crop) =>
                        crop.status === "AVAILABLE" &&
                        Number(crop.quantity) > 0,
                    )
                    .slice(0, 5)
                    .map((crop, index) => (
                      <div key={crop.id} className="queue-row">
                        <span className="queue-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="queue-crop">
                          <strong>{crop.crop_name}</strong>
                          <small>
                            #{crop.id} · Harvested{" "}
                            {formatDate(crop.harvest_date)}
                          </small>
                        </div>
                        <div className="queue-quantity">
                          <strong>{amount(crop.quantity)} kg</strong>
                          <ExpiryDate value={crop.expiry_date} />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyState title="No available batches">
                  <p>Registered batches will appear here.</p>
                </EmptyState>
              )}
              <div className="info-note">
                <strong>How FIFO works</strong>
                <p>
                  Distribute the oldest available batch first. A partial
                  distribution keeps that batch at the front until its quantity
                  reaches zero.
                </p>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}
