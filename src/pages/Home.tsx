import { Link } from "react-router-dom";

interface Experiment {
  path: string;
  title: string;
}

const experiments: Experiment[] = [
  {
    path: "/audio",
    title:
      "Audio Playground — Web Audio API, procedural sounds, sound profiles",
  },
];

export default function Home() {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "10vh 1rem",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
        Web Playground
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        A place to test random web things across devices.
      </p>

      {experiments.length === 0 ? (
        <p style={{ color: "#999" }}>No experiments yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {experiments.map((e) => (
            <li key={e.path} style={{ marginBottom: "0.5rem" }}>
              <Link to={e.path} style={{ color: "#0969da" }}>
                {e.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
