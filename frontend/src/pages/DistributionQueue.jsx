import { useState } from "react";
import { Link } from "react-router-dom";
import useResource from "../hooks/useResource.js";
import api, { errorMessage, readData } from "../services/api.js";
import { amount } from "../utils/format.js";
import Icon from "../components/Icon.jsx";
import CropIcon from "../components/CropIcon.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  CROP_ROLES,
  DISTRIBUTION_ROLES,
  hasRole,
} from "../utils/permissions.js";
import {
  Alert,
  BatchDetails,
  EmptyState,
  PageHeading,
  ResourceState,
} from "../components/Shared.jsx";

const loadNext = (signal) => readData("/crops/next", signal);

export default function DistributionQueue() {
  const { user } = useAuth();
  const canDistribute = hasRole(user, DISTRIBUTION_ROLES);
  const canManage = hasRole(user, CROP_ROLES);
  const { data: crop, loading, error, reload } = useResource(loadNext);
  const [quantity, setQuantity] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  async function distribute(event) {
    event.preventDefault();
    if (busy || loading || !crop || !canDistribute) return;
    const value = Number(quantity);
    if (
      !Number.isFinite(value) ||
      value <= 0 ||
      value > Number(crop.quantity)
    ) {
      setActionError(
        "Enter a positive quantity within the current batch's available stock.",
      );
      return;
    }
    setBusy(true);
    setActionError("");
    setMessage("");
    try {
      // The backend chooses the oldest batch. Its API accepts quantity only.
      const response = await api.post("/distributions", { quantity: value });
      const result = response.data.data;
      setMessage(
        `Distributed ${amount(result.distributedQuantity)} kg of ${result.cropName} from batch #${result.cropBatchId}. Remaining in that batch: ${amount(result.remainingQuantity)} kg.`,
      );
      setQuantity("");
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
      reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="FIRST IN, FIRST OUT"
        title="FIFO distribution"
        description="Distribute from the oldest available harvest, one batch at a time."
      >
        <button
          className="button secondary"
          onClick={() => {
            setQuantity("");
            reload();
          }}
          disabled={loading || busy}
        >
          <Icon name="refresh" size={18} />
          Refresh queue
        </button>
        {user && (
          <Link className="button secondary" to="/history">
            <Icon name="history" size={18} />
            View history
          </Link>
        )}
      </PageHeading>
      <Alert success>{message}</Alert>
      <Alert>{actionError}</Alert>
      <ResourceState loading={loading} error={error} retry={reload} />
      {!loading &&
        !error &&
        (crop ? (
          <div className="distribution-grid">
            <article className="panel next-panel">
              <div className="distribution-illustration">
                <img
                  src={`${import.meta.env.BASE_URL}images/sri-lanka-harvest-crate.png`}
                  alt=""
                  width="200"
                  height="178"
                />
              </div>
              <p className="eyebrow">NEXT AVAILABLE BATCH</p>
              <div className="next-crop-title">
                <CropIcon name={crop.crop_name} />
                <h2 className="crop-title">{crop.crop_name}</h2>
              </div>
              <BatchDetails crop={crop} />
            </article>
            {canDistribute ? (
              <form className="panel form-card" onSubmit={distribute}>
                <div className="section-heading">
                  <div>
                    <h2>Record a distribution</h2>
                    <p>
                      Available in the current batch: {amount(crop.quantity)} kg
                    </p>
                  </div>
                </div>
                <label>
                  Quantity to distribute (kg)
                  <input
                    type="number"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    min="0.01"
                    max={Number(crop.quantity)}
                    step="0.01"
                    placeholder="Enter quantity"
                    required
                    disabled={busy}
                  />
                </label>
                <p className="muted">
                  A partial distribution keeps this batch at the front. Empty it
                  to move to the next batch.
                </p>
                <div className="info-note">
                  <strong>The queue can change</strong>
                  <p>
                    The server distributes from whichever batch is first when it
                    processes your request. The confirmation shows the actual
                    batch used.
                  </p>
                </div>
                <button className="button primary stretch" disabled={busy}>
                  {busy ? "Distributing…" : "Confirm FIFO distribution"}
                </button>
              </form>
            ) : (
              <section className="panel queue-access">
                <span className="auth-emblem">
                  <Icon name="truck" size={30} />
                </span>
                <p className="eyebrow">FIRST IN, FIRST OUT</p>
                <h2>Follow the oldest harvest.</h2>
                <p>
                  The batch shown here is next in the FIFO queue. A partial
                  distribution keeps it at the front until its remaining stock
                  is used.
                </p>
                <div className="approval-note">
                  <Icon name="lock" size={21} />
                  <p>
                    {user
                      ? "Your Farm Manager account can manage crops. Distributions are recorded by Distributors and Admins."
                      : "Sign in with an approved Distributor or Admin account to record a distribution."}
                  </p>
                </div>
                <div className="button-row">
                  {!user && (
                    <Link
                      className="button primary"
                      to="/login"
                      state={{ from: "/distribution" }}
                    >
                      Sign in to distribute
                    </Link>
                  )}
                  <Link
                    className="button secondary"
                    to={user ? "/crops" : "/register"}
                  >
                    {user ? "View crop batches" : "Create account"}
                  </Link>
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="panel">
            <EmptyState title="No batches to distribute">
              <p>
                {canManage
                  ? "Add an available crop batch to start the queue."
                  : "The queue will update when a Farm Manager registers an available batch."}
              </p>
              {canManage && (
                <Link className="button primary" to="/crops/add">
                  Add crop batch
                </Link>
              )}
            </EmptyState>
          </div>
        ))}
    </>
  );
}
