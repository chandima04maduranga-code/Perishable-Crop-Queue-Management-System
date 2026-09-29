import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CropForm from "../components/CropForm.jsx";
import { Alert, PageHeading, ResourceState } from "../components/Shared.jsx";
import useResource from "../hooks/useResource.js";
import api, { readData } from "../services/api.js";
import { inputDate } from "../utils/format.js";

export default function EditCrop() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loader = useCallback(
    async (signal) => {
      const [crop, history] = await Promise.all([
        readData(`/crops/${id}`, signal),
        readData("/distributions", signal),
      ]);
      return {
        crop,
        locked:
          crop.status === "DISTRIBUTED" ||
          history.some((item) => String(item.crop_batch_id) === String(id)),
      };
    },
    [id],
  );
  const { data, loading, error, reload } = useResource(loader);
  async function save(form) {
    await api.put(`/crops/${id}`, form);
    navigate("/crops", {
      state: { message: "Crop batch updated successfully." },
    });
  }
  return (
    <>
      <PageHeading
        eyebrow="CROP MANAGEMENT"
        title={`Edit batch #${id}`}
        description="Update details before the batch has distribution records."
      />
      <ResourceState loading={loading} error={error} retry={reload} />
      {data &&
        (data.locked ? (
          <div className="panel">
            <Alert>
              This batch has been distributed. Its history is retained and
              editing is disabled in this interface.
            </Alert>
            <Link to="/crops">Return to crop batches</Link>
          </div>
        ) : (
          <CropForm
            key={id}
            editing
            onSave={save}
            initialValues={{
              cropName: data.crop.crop_name,
              quantity: data.crop.quantity,
              harvestDate: inputDate(data.crop.harvest_date),
              expiryDate: inputDate(data.crop.expiry_date),
              storageLocation: data.crop.storage_location,
            }}
          />
        ))}
    </>
  );
}
