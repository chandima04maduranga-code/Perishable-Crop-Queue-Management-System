import useResource from "../hooks/useResource.js";
import { readData } from "../services/api.js";
import { amount, formatTime } from "../utils/format.js";
import {
  EmptyState,
  PageHeading,
  ResourceState,
} from "../components/Shared.jsx";

const loadHistory = (signal) => readData("/distributions", signal);

export default function DistributionHistory() {
  const { data, loading, error, reload } = useResource(loadHistory);
  return (
    <>
      <PageHeading
        eyebrow="DISTRIBUTION RECORDS"
        title="Distribution history"
        description="Every recorded movement, with the latest distribution first."
      >
        <button
          className="button secondary"
          onClick={reload}
          disabled={loading}
        >
          Refresh
        </button>
      </PageHeading>
      <ResourceState loading={loading} error={error} retry={reload} />
      {data && (
        <div className="panel table-panel">
          <div className="table-summary">
            <strong>{data.length} distribution records</strong>
            <span>
              {amount(
                data.reduce((sum, item) => sum + Number(item.quantity), 0),
              )}{" "}
              kg distributed
            </span>
          </div>
          {data.length ? (
            <div className="table-scroll">
              <table>
                <caption className="sr-only">Distribution history</caption>
                <thead>
                  <tr>
                    <th>Record</th>
                    <th>Batch</th>
                    <th>Crop</th>
                    <th>Quantity</th>
                    <th>Distributed at</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td className="muted">#{item.id}</td>
                      <td>#{item.crop_batch_id}</td>
                      <td>
                        <strong>{item.crop_name}</strong>
                      </td>
                      <td>{amount(item.quantity)} kg</td>
                      <td>{formatTime(item.distributed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No distributions recorded">
              <p>Completed distributions will appear here.</p>
            </EmptyState>
          )}
          <p className="table-footer">
            Distribution times are shown in your browser's local timezone.
          </p>
        </div>
      )}
    </>
  );
}
