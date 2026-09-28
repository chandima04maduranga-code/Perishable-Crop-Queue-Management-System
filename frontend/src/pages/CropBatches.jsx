import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useResource from "../hooks/useResource.js";
import api, { errorMessage, readData } from "../services/api.js";
import { amount, formatDate } from "../utils/format.js";
import {
  Alert,
  EmptyState,
  ExpiryDate,
  PageHeading,
  ResourceState,
  StatusBadge,
} from "../components/Shared.jsx";

async function loadBatches(signal) {
  const [crops, history] = await Promise.all([
    readData("/crops", signal),
    readData("/distributions", signal),
  ]);
  return {
    crops,
    usedIds: new Set(history.map((item) => String(item.crop_batch_id))),
  };
}

export default function CropBatches() {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const [actionError, setActionError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const { data, loading, error, reload } = useResource(loadBatches);
  const filtered =
    data?.crops.filter(
      (crop) =>
        (status === "ALL" || crop.status === status) &&
        `${crop.crop_name} ${crop.storage_location} ${crop.id}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    ) || [];

  async function remove(crop) {
    if (
      deleting !== null ||
      !window.confirm(
        `Delete batch #${crop.id} (${crop.crop_name})? This cannot be undone.`,
      )
    )
      return;
    setDeleting(crop.id);
    setActionError("");
    setMessage("");
    try {
      await api.delete(`/crops/${crop.id}`);
      setMessage(`Batch #${crop.id} deleted.`);
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="CROP MANAGEMENT"
        title="Crop batches"
        description="Manage your harvest, check expiry dates and keep stock organised."
      >
        <button
          className="button secondary"
          onClick={reload}
          disabled={loading || deleting !== null}
        >
          Refresh
        </button>
        <Link className="button primary" to="/crops/add">
          + Add crop batch
        </Link>
      </PageHeading>
      <Alert success>{message}</Alert>
      <Alert>{actionError}</Alert>
      <div className="toolbar">
        <label className="search-label">
          Search batches
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Crop name, storage or batch ID"
          />
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="ALL">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="DISTRIBUTED">Distributed</option>
          </select>
        </label>
      </div>
      <ResourceState loading={loading} error={error} retry={reload} />
      {data && (
        <div className="panel table-panel">
          <div className="table-summary">
            <strong>{filtered.length} batches</strong>
            <span>Sorted by harvest date · oldest first</span>
          </div>
          {filtered.length ? (
            <div className="table-scroll">
              <table>
                <caption className="sr-only">Registered crop batches</caption>
                <thead>
                  <tr>
                    <th>Batch</th>
                    <th>Crop</th>
                    <th>Remaining</th>
                    <th>Harvest date</th>
                    <th>Expiry date</th>
                    <th>Storage</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((crop) => {
                    const locked =
                      data.usedIds.has(String(crop.id)) ||
                      crop.status === "DISTRIBUTED";
                    return (
                      <tr key={crop.id}>
                        <td className="muted">#{crop.id}</td>
                        <td>
                          <strong>{crop.crop_name}</strong>
                        </td>
                        <td className="nowrap">{amount(crop.quantity)} kg</td>
                        <td className="nowrap">
                          {formatDate(crop.harvest_date)}
                        </td>
                        <td className="nowrap">
                          <ExpiryDate
                            value={crop.expiry_date}
                            active={crop.status === "AVAILABLE"}
                          />
                        </td>
                        <td>{crop.storage_location}</td>
                        <td>
                          <StatusBadge status={crop.status} />
                        </td>
                        <td>
                          {locked ? (
                            <span
                              className="muted lock-note"
                              title="A distribution record exists or this batch is fully distributed."
                            >
                              History retained
                            </span>
                          ) : (
                            <div className="row-actions">
                              <Link
                                to={`/crops/${crop.id}/edit`}
                                aria-label={`Edit batch ${crop.id}`}
                              >
                                Edit
                              </Link>
                              <button
                                className="text-button danger-text"
                                onClick={() => remove(crop)}
                                disabled={deleting !== null}
                                aria-label={`Delete batch ${crop.id}`}
                              >
                                {deleting === crop.id ? "Deleting…" : "Delete"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title={
                data.crops.length
                  ? "No matching batches"
                  : "No crop batches yet"
              }
            >
              <p>
                {data.crops.length
                  ? "Try another search or status."
                  : "Add your first harvest to start the FIFO queue."}
              </p>
            </EmptyState>
          )}
          <p className="table-footer">
            Editing and deleting are disabled here once a batch has distribution
            history.
          </p>
        </div>
      )}
    </>
  );
}
