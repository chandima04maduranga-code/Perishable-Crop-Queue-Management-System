export default function StatCard({ title, value, description, tone = "" }) {
  return (
    <article className={`stat-card ${tone}`}>
      <p>{title}</p>
      <strong>{value}</strong>
      <span>{description}</span>
    </article>
  );
}
