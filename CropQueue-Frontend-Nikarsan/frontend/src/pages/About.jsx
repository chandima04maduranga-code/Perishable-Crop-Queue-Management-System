import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeading } from "../components/Shared.jsx";
import Icon from "../components/Icon.jsx";
export default function About() {
  const { user } = useAuth();
  return (
    <>
      <PageHeading
        eyebrow="FROM HARVEST TO HANDOVER"
        title="Every harvest deserves a future."
        description="CropQueue helps teams organise perishable crops and reduce waste by distributing older harvests first."
      >
        <Link className="button primary" to="/crops">
          Explore crop batches
          <Icon name="arrow" size={18} />
        </Link>
      </PageHeading>
      <div className="how-grid">
        {[
          [
            "01",
            "sprout",
            "Record the harvest",
            "Farm Managers add the crop name, quantity, harvest date, expiry date and storage location.",
          ],
          [
            "02",
            "list",
            "Follow the FIFO queue",
            "First In, First Out means the oldest harvest is prioritised. Check expiry dates as well as queue order.",
          ],
          [
            "03",
            "truck",
            "Distribute and track",
            "Distributors record a quantity from the next batch. Remaining stock and history are updated.",
          ],
        ].map(([step, icon, title, body]) => (
          <article className="panel how-card" key={step}>
            <div>
              <span className="section-icon green">
                <Icon name={icon} size={26} />
              </span>
              <span className="how-step">{step}</span>
            </div>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <section className="panel about-access">
        <div>
          <p className="eyebrow">OPEN TO EVERYONE</p>
          <h2>Browse freely. Contribute with your role.</h2>
          <p>
            Anyone can view the overview, crop batches and FIFO status. Approved
            accounts can perform the tasks assigned to them.
          </p>
          <div className="role-descriptions">
            <p>
              <strong>Farm Manager</strong>
              <span>Add, edit and delete eligible crop batches.</span>
            </p>
            <p>
              <strong>Distributor</strong>
              <span>Record partial or full FIFO distributions.</span>
            </p>
            <p>
              <strong>Admin</strong>
              <span>
                Approve accounts, manage roles and access all features.
              </span>
            </p>
          </div>
          <p className="muted">
            All approved signed-in users can view distribution history.
          </p>
          <div className="button-row">
            <Link
              className="button primary"
              to={user ? "/account" : "/register"}
            >
              {user ? "My account" : "Create an account"}
            </Link>
            <Link className="button secondary" to="/distribution">
              View FIFO queue
            </Link>
          </div>
        </div>
        <img
          src={`${import.meta.env.BASE_URL}images/sri-lanka-harvest-crate.png`}
          alt="Illustrated crate of fresh Sri Lankan vegetables"
          width="320"
          height="285"
        />
      </section>
    </>
  );
}
