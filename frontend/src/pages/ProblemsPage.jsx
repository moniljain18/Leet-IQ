import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, CheckCircle2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";

import { useAuth } from "@clerk/clerk-react"; // Import useAuth

function ProblemsPage() {
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth(); // Destructure getToken

  const problems = Object.values(PROBLEMS);

  useEffect(() => {
    const fetchSolvedIds = async () => {
      try {
        const token = await getToken();
        const response = await axiosInstance.get("/contests/submissions/solved", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSolvedIds(new Set(response.data));
      } catch (error) {
        console.error("Failed to fetch solved IDs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSolvedIds();
  }, [getToken]); // Add dependency

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  const solvedEasy = problems.filter(p => p.difficulty === "Easy" && solvedIds.has(p.id)).length;
  const solvedMedium = problems.filter(p => p.difficulty === "Medium" && solvedIds.has(p.id)).length;
  const solvedHard = problems.filter(p => p.difficulty === "Hard" && solvedIds.has(p.id)).length;


  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-base-content/70">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-base-100 hover:scale-[1.01] transition-transform"
            >
              <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Code2Icon className="size-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold">{problem.title}</h2>
                          {solvedIds.has(problem.id) && (
                            <CheckCircle2Icon className="size-5 text-success" />
                          )}
                          <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-base-content/60"> {problem.category}</p>
                      </div>
                    </div>
                    <p className="text-base-content/80 mb-3">{problem.description.text}</p>
                  </div>
                  {/* RIGHT SIDE */}

                  <div className="flex items-center gap-2 text-primary">
                    <span className="font-medium">Solve</span>
                    <ChevronRightIcon className="size-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{problems.length}</div>
              </div>

              <div className="stat">
                <div className="stat-title uppercase font-black text-[10px] opacity-40">Easy</div>
                <div className="stat-value text-success text-2xl">{solvedEasy}<span className="text-sm opacity-20 font-normal"> / {easyProblemsCount}</span></div>
                <div className="stat-desc">Solved</div>
              </div>
              <div className="stat">
                <div className="stat-title uppercase font-black text-[10px] opacity-40">Medium</div>
                <div className="stat-value text-warning text-2xl">{solvedMedium}<span className="text-sm opacity-20 font-normal"> / {mediumProblemsCount}</span></div>
                <div className="stat-desc">Solved</div>
              </div>
              <div className="stat">
                <div className="stat-title uppercase font-black text-[10px] opacity-40">Hard</div>
                <div className="stat-value text-error text-2xl">{solvedHard}<span className="text-sm opacity-20 font-normal"> / {hardProblemsCount}</span></div>
                <div className="stat-desc">Solved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
