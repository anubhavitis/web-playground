import { useEffect } from "react";
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
  useEffect(() => {
    document.title = "Web Playground";
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="max-w-xl mx-auto px-4 pt-[10vh] pb-16">
        <h1 className="text-2xl font-bold mb-1">Web Playground</h1>
        <p className="text-zinc-500 mb-8">
          A place to test random web things across devices.
        </p>

        {experiments.length === 0 ? (
          <p className="text-zinc-600">No experiments yet.</p>
        ) : (
          <ul className="space-y-2">
            {experiments.map((e) => (
              <li key={e.path}>
                <Link
                  to={e.path}
                  className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
                >
                  {e.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
