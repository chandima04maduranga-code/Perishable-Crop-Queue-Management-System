import { useNavigate } from "react-router-dom";
import CropForm from "../components/CropForm.jsx";
import { PageHeading } from "../components/Shared.jsx";
import api from "../services/api.js";

export default function AddCrop() {
  const navigate = useNavigate();
  async function save(form) {
    await api.post("/crops", form);
    navigate("/crops", {
      state: { message: "Crop batch created successfully." },
    });
  }
  return (
    <>
      <PageHeading
        eyebrow="CROP MANAGEMENT"
        title="Add a crop batch"
        description="Register a harvest and give every batch a place in the queue."
      />
      <CropForm onSave={save} />
    </>
  );
}
