import { useEffect, useState } from "react";
import Icon from "./Icon";

const MAX_COMMITS = 3;
const SHA_LENGTH = 5;

type Commit = {
  repo: string;
  message: string;
  sha: string;
  url: string;
  author: string;
  timestamp: string;
};

export default function GitHubCommits() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/github/commits?limit=${MAX_COMMITS}`)
      .then((res) => res.json())
      .then(setCommits)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="font-mono text-xs max-w-[20em] max-h-[55em] overflow-y-auto hide-scrollbar">
      <ul className="space-y-[0.5em]">
        <Icon imageUrl='https://img.icons8.com/?size=100&id=3tC9EQumUAuq&format=png&color=000000'/>
        {commits.map((commit) => (
          <li key={commit.sha} className="bg-zinc-900 py-1 px-[0.5em] rounded shadow">
            <div className="text-green-600">{commit.sha.slice(0,SHA_LENGTH)}</div>
            <a
              href={commit.url}
              className="text-blue-400 text-xs"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-wrap">{commit.message.slice(0, 70)}...</div>
            </a>

            <div className="">{new Date(commit.timestamp).toISOString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
