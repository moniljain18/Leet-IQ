import { useState, useEffect } from "react";
import {
  ListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShuffleIcon,
  CheckCircle2Icon,
  HistoryIcon,
  XCircleIcon,
  FileTextIcon,
  FilterIcon
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import axiosInstance from "../lib/axios";
import { useAuth } from "@clerk/clerk-react";
import confetti from "canvas-confetti";

function ProblemDescription({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
  contestId,
  submissions = [],
  isLoadingSubmissions = false
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [statusFilter, setStatusFilter] = useState("all");
  const [langFilter, setLangFilter] = useState("all");
  const [solvedIds, setSolvedIds] = useState(new Set());
  const { getToken } = useAuth();

  const fetchSolvedIds = async () => {
    try {
      const token = await getToken();
      const url = contestId
        ? `/contests/submissions/solved?contestId=${contestId}`
        : "/contests/submissions/solved";

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolvedIds(new Set(response.data));
    } catch (error) {
      console.error("Failed to fetch solved IDs:", error);
    }
  };

  useEffect(() => {
    fetchSolvedIds();
  }, [submissions, currentProblemId]);

  // Check for All Problems Solved in Contest
  useEffect(() => {
    if (contestId && allProblems.length > 0 && solvedIds.size === allProblems.length) {
      // Trigger modal
      const modal = document.getElementById('contest_complete_modal');
      if (modal) {
        modal.showModal();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [solvedIds, allProblems.length, contestId]);

  const isSolved = submissions.some(s => s.status === "Accepted");

  // Find indices for navigation
  const currentIndex = allProblems.findIndex(p => p.id === currentProblemId);
  const prevProblem = currentIndex > 0 ? allProblems[currentIndex - 1] : null;
  const nextProblem = currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null;

  const handleShuffle = () => {
    if (allProblems.length <= 1) return;
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * allProblems.length);
    } while (randomIndex === currentIndex);
    onProblemChange(allProblems[randomIndex].id);
  };

  const filteredSubmissions = submissions.filter(s => {
    const matchesStatus = statusFilter === "all" || (statusFilter === "completed" && s.status === "Accepted") || (statusFilter === "error" && s.status !== "Accepted");
    const matchesLang = langFilter === "all" || s.language === langFilter;
    return matchesStatus && matchesLang;
  });

  return (
    <div className="h-full flex flex-col bg-base-100">
      {/* NAVIGATION & TABS HEADER */}
      <div className="flex flex-col border-b border-base-300">
        {/* Navigation Bar (Always Visible) */}
        <div className="px-4 py-2 bg-base-200 flex items-center justify-between border-b border-base-300">
          <div className="flex items-center gap-1">
            {/* Problem List Breadcrumb */}
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost btn-xs gap-2 rounded-lg px-2 normal-case font-bold group">
                <span className="text-base-content/60 group-hover:text-primary transition-colors">Problem List</span>
                <ChevronRightIcon className="size-3 text-base-content/40 group-hover:text-primary transition-colors" />
                <div className="flex items-center gap-1.5 ml-4">
                  <div className="relative size-4">
                    <svg className="size-full" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-base-content/10" strokeWidth="3"></circle>
                      <circle
                        cx="18" cy="18" r="16" fill="none"
                        className="stroke-success"
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset={100 - (allProblems.filter(p => solvedIds.has(p.id)).length / allProblems.length * 100)}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      ></circle>
                    </svg>
                  </div>
                  <span className="text-[11px] text-base-content/60 font-medium">
                    {allProblems.filter(p => solvedIds.has(p.id)).length}/{allProblems.length} Solved
                  </span>
                </div>
              </label>
              <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow-2xl bg-base-200 rounded-2xl border border-base-300 w-64 mt-2 max-h-[400px] overflow-y-auto">
                <li className="menu-title text-[10px] uppercase tracking-widest opacity-40 font-black">All Problems</li>
                {allProblems.map((p, idx) => (
                  <li key={p.id}>
                    <button
                      onClick={() => onProblemChange(p.id)}
                      className={`text-xs py-2 flex items-center justify-between ${p.id === currentProblemId ? 'bg-primary/20 text-primary font-bold' : ''}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {solvedIds.has(p.id) ? (
                          <CheckCircle2Icon className="size-3 text-success shrink-0" />
                        ) : (
                          <div className="size-3 shrink-0" /> // Placeholder
                        )}
                        <span className="truncate">{idx + 1}. {p.title}</span>
                      </div>
                      <span className={`badge badge-xs ${getDifficultyBadgeClass(p.difficulty)}`}>{p.difficulty[0]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => prevProblem && onProblemChange(prevProblem.id)}
              disabled={!prevProblem}
              className="btn btn-ghost btn-xs rounded-lg px-2 disabled:opacity-30"
              title="Previous Problem"
            >
              <ChevronLeftIcon className="size-4" />
            </button>

            {/* Only show shuffle in practice mode */}
            {!contestId && (
              <button
                onClick={handleShuffle}
                className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-primary hover:bg-primary/10 transition-colors"
                title="Random Problem"
              >
                <ShuffleIcon className="size-4" />
              </button>
            )}

            <button
              onClick={() => nextProblem && onProblemChange(nextProblem.id)}
              disabled={!nextProblem}
              className="btn btn-ghost btn-xs rounded-lg px-2 disabled:opacity-30"
              title="Next Problem"
            >
              <ChevronRightIcon className="size-4" />
            </button>

            <div className="h-4 w-px bg-base-300 mx-1" />

            <span className="text-[10px] font-mono font-black opacity-30 uppercase tracking-tighter">
              {currentIndex + 1} / {allProblems.length}
            </span>
          </div>
        </div>

        <div className="px-4 flex gap-4">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-3 px-2 flex items-center gap-2 border-b-2 transition-all font-medium text-sm ${activeTab === "description" ? "border-primary text-primary" : "border-transparent text-base-content/60 hover:text-base-content"
              }`}
          >
            <FileTextIcon className="size-4" />
            Description
          </button>
          {contestId && (
            <button
              onClick={() => setActiveTab("submissions")}
              className={`py-3 px-2 flex items-center gap-2 border-b-2 transition-all font-medium text-sm ${activeTab === "submissions" ? "border-primary text-primary" : "border-transparent text-base-content/60 hover:text-base-content"
                }`}
            >
              <HistoryIcon className="size-4" />
              Submissions
            </button>
          )}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "description" ? (
          <div className="p-6 space-y-8 animate-in fade-in duration-300">
            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-black text-base-content">{problem.title}</h1>
                  {isSolved && (
                    <div className="flex items-center gap-1.5 text-success font-bold text-xs">
                      <CheckCircle2Icon className="size-3" />
                      SOLVED
                    </div>
                  )}
                </div>
                <span className={`badge badge-lg font-bold rounded-xl ${getDifficultyBadgeClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>
              <p className="text-base-content/80 text-lg leading-relaxed">{problem.description.text}</p>
              {problem.description.notes && (
                <div className="space-y-2">
                  {problem.description.notes.map((note, idx) => (
                    <p key={idx} className="text-base-content/60 italic text-sm">{note}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Examples Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <SparklesIcon size={20} className="text-primary" />
                Examples
              </h2>
              <div className="space-y-6">
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-base-content/60">
                      <span className="bg-base-200 px-2 py-0.5 rounded-md">Example {idx + 1}</span>
                    </div>
                    <div className="card bg-base-200 border border-base-300 rounded-2xl overflow-hidden font-mono text-sm">
                      <div className="p-4 space-y-2">
                        <div className="flex gap-4">
                          <span className="text-primary font-bold min-w-[70px]">Input:</span>
                          <span className="break-all">{ex.input}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-secondary font-bold min-w-[70px]">Output:</span>
                          <span>{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="mt-2 pt-2 border-t border-base-300 text-xs text-base-content/60 italic">
                            <span className="font-bold font-sans">Explanation:</span> {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ConstraintsSection */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Constraints</h2>
              <div className="flex flex-wrap gap-2">
                {problem.constraints.map((c, i) => (
                  <code key={i} className="bg-base-200 border border-base-300 px-3 py-1.5 rounded-xl text-sm font-mono text-primary">
                    {c}
                  </code>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4 animate-in slide-in-from-right duration-300">
            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
              <FilterIcon className="size-4 text-base-content/40" />
              <select
                className="select select-sm select-bordered rounded-xl text-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Accepted</option>
                <option value="error">Errors</option>
              </select>
              <select
                className="select select-sm select-bordered rounded-xl text-xs"
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
              >
                <option value="all">All Langs</option>
                <option value="javascript">Javascript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>

            {isLoadingSubmissions ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <p className="text-sm text-base-content/40">Loading history...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-12 text-base-content/40 italic flex flex-col items-center">
                <HistoryIcon className="size-12 mb-3 opacity-20" />
                No submissions found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((s) => (
                  <div key={s._id} className="card bg-base-100 border border-base-300 p-4 rounded-2xl hover:border-primary transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {s.status === "Accepted" ? (
                          <CheckCircle2Icon className="size-4 text-success" />
                        ) : (
                          <XCircleIcon className="size-4 text-error" />
                        )}
                        <span className={`font-bold text-sm ${s.status === "Accepted" ? "text-success" : "text-error"}`}>
                          {s.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-base-content/40">
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="badge badge-outline badge-sm rounded-lg opacity-60">{s.language}</div>
                      <div className="text-xs font-mono text-base-content/60">
                        {s.runtime}ms • {s.score} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* CONTEST COMPLETE MODAL */}
      <dialog id="contest_complete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box text-center">
          <h3 className="font-bold text-2xl text-primary mb-2">🎉 Congratulations Coder! 🚀</h3>
          <p className="py-4 text-lg font-medium">You solved the entire contest!</p>
          <div className="py-2 opacity-70">
            <p>All {allProblems.length} problems completed.</p>
          </div>
          <div className="modal-action justify-center">
            <form method="dialog">
              <button className="btn btn-primary px-8">Awesome!</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

const SparklesIcon = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

export default ProblemDescription;
