import { useCallback, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import useResource from "../hooks/useResource.js";
import api, { errorMessage, readData } from "../services/api.js";
import {
  amount,
  expiryLabel,
  formatDate,
  nearExpiry,
} from "../utils/format.js";
import CropIcon from "../components/CropIcon.jsx";
import Icon from "../components/Icon.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { CROP_ROLES, hasRole } from "../utils/permissions.js";
import {
  Alert,
  EmptyState,
  ExpiryDate,
  PageHeading,
  ResourceState,
  StatusBadge,
} from "../components/Shared.jsx";

async function loadBatches(signal, canManage) {
  const [crops, history] = await Promise.all([
    readData("/crops", signal),
    canManage ? readData("/distributions", signal) : Promise.resolve([]),
  ]);
  return {
    crops,
    usedIds: new Set(history.map((item) => String(item.crop_batch_id))),
  };
}

export default function CropBatches() {
  const { user } = useAuth();
  const canManage = hasRole(user, CROP_ROLES);
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const [actionError, setActionError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const status = params.get("status") || "ALL";
  const expiry = params.get("filter") || "ALL";
  function setFilter(key, value) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (!value || value === "ALL") next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  }
  const loader = useCallback(
    (signal) => loadBatches(signal, canManage),
    [canManage],
  );
  const { data, loading, error, reload } = useResource(loader);
  const filtered =
    data?.crops.filter(
      (crop) =>
        (status === "ALL" || crop.status === status) &&
        (expiry === "ALL" ||
          (crop.status === "AVAILABLE" &&
            (expiry === "expiring"
              ? nearExpiry(crop.expiry_date)
              : expiryLabel(crop.expiry_date).className === "danger-text"))) &&
        `${crop.crop_name} ${crop.storage_location} ${crop.id}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    ) || [];

  async function remove(crop) {
    if (
      !canManage ||
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
          <Icon name="refresh" size={18} />
          Refresh
        </button>
        {canManage && (
          <Link className="button primary" to="/crops/add">
            <Icon name="plus" size={20} />
            Add crop batch
          </Link>
        )}
      </PageHeading>
      <Alert success>{message}</Alert>
      <Alert>{actionError}</Alert>
      <div className="toolbar">
        <label className="search-label">
          Search batches
          <input
            type="search"
            value={search}
            onChange={(event) => setFilter("q", event.target.value)}
            placeholder="Crop name, storage or batch ID"
          />
        </label>
        <label>
          Status
          <select
            aria-label="Status"
            value={status}
            onChange={(event) => setFilter("status", event.target.value)}
          >
            <option value="ALL">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="DISTRIBUTED">Distributed</option>
          </select>
        </label>
        <label>
          Expiry
          <select
            aria-label="Expiry"
            value={expiry}
            onChange={(event) => setFilter("filter", event.target.value)}
          >
            <option value="ALL">All expiry dates</option>
            <option value="expiring">Within 3 days</option>
            <option value="expired">Past expiry</option>
          </select>
        </label>
        {(search || status !== "ALL" || expiry !== "ALL") && (
          <button
            className="button secondary clear-filter"
            onClick={() => setParams({})}
          >
            Clear filters
          </button>
        )}
      </div>
      <ResourceState loading={loading} error={error} retry={reload} />
      {data && (
        <div className="panel table-panel">
          <div className="table-summary">
            <strong>
              {filtered.length} {filtered.length === 1 ? "batch" : "batches"}
            </strong>
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
                    {canManage && <th>Actions</th>}
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
                          <div className="crop-cell">
                            <CropIcon name={crop.crop_name} />
                            <strong>{crop.crop_name}</strong>
                          </div>
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
                          <StatusBadge
                            status={crop.status}
                            expiry={crop.expiry_date}
                          />
                        </td>
                        {canManage && (
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
                                  {deleting === crop.id
                                    ? "Deleting…"
                                    : "Delete"}
                                </button>
                              </div>
                            )}
                          </td>
                        )}
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
                  ? "Try another search, status or expiry filter."
                  : canManage
                    ? "Add your first harvest to start the FIFO queue."
                    : "Crop batches will appear here when they are registered."}
              </p>
            </EmptyState>
          )}
          <p className="table-footer">
            {canManage
              ? "Editing and deleting are disabled here once a batch has distribution history."
              : "Browse and filter crop records. Approved Farm Managers and Admins can manage batches."}
          </p>
        </div>
      )}
    </>
  );
}
