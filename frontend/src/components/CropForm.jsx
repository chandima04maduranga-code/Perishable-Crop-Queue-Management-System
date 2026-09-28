import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "./Shared.jsx";
import { errorMessage } from "../services/api.js";

const emptyForm = {
  cropName: "",
  quantity: "",
  harvestDate: "",
  expiryDate: "",
  storageLocation: "",
};

export default function CropForm({
  initialValues = emptyForm,
  onSave,
  editing = false,
}) {
  const [form, setForm] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function change(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    const quantity = Number(form.quantity);
    if (!form.cropName.trim() || !form.storageLocation.trim()) {
      setError("Crop name and storage location are required.");
      return;
    }
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 99999999.99) {
      setError("Enter a quantity between 0.01 and 99,999,999.99 kg.");
      return;
    }
    if (
      !form.harvestDate ||
      !form.expiryDate ||
      form.expiryDate < form.harvestDate
    ) {
      setError("Expiry date must be on or after the harvest date.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        cropName: form.cropName.trim(),
        storageLocation: form.storageLocation.trim(),
        quantity,
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel form-card" onSubmit={submit}>
      <div className="section-heading">
        <div>
          <h2>Batch information</h2>
          <p>All fields are required. Quantities are measured in kilograms.</p>
        </div>
        <span className="step-label">01 / DETAILS</span>
      </div>
      <Alert>{error}</Alert>
      <fieldset disabled={saving} className="form-grid">
        <label>
          Crop name
          <input
            name="cropName"
            value={form.cropName}
            onChange={change}
            placeholder="e.g. Tomatoes"
            maxLength={100}
            required
          />
        </label>
        <label>
          Quantity (kg)
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={change}
            placeholder="e.g. 100"
            min="0.01"
            max="99999999.99"
            step="0.01"
            required
          />
        </label>
        <label>
          Harvest date
          <input
            type="date"
            name="harvestDate"
            value={form.harvestDate}
            onChange={change}
            required
          />
        </label>
        <label>
          Expiry date
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={change}
            min={form.harvestDate || undefined}
            required
          />
        </label>
        <label className="full-width">
          Storage location
          <input
            name="storageLocation"
            value={form.storageLocation}
            onChange={change}
            placeholder="e.g. Cold Room A"
            maxLength={150}
            required
          />
        </label>
      </fieldset>
      <div className="form-actions">
        <p className="muted">Review the dates before saving.</p>
        <div>
          <Link className="button secondary" to="/crops">
            Cancel
          </Link>
          <button className="button primary" disabled={saving}>
            {saving
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Create crop batch"}
          </button>
        </div>
      </div>
    </form>
  );
}
