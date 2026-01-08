import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProblemSidebar from "../components/ProblemSidebar";
import {
  ChevronRightIcon, Code2Icon, CheckCircle2Icon, LockIcon,
  BuildingIcon, CrownIcon, SparklesIcon, SearchIcon, FilterIcon,
  ArrowUpDownIcon, XIcon
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useState, useEffect, useMemo, useRef } from "react";
import axiosInstance from "../lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getAllProblemsPublic } from "../api/problems";
import { usePremium } from "../hooks/usePremium";
import { useProfile } from "../hooks/useAuth";

function ProblemsPage() {
  const [solvedIds, setSolvedIds] = useState(new Set());
  const { getToken } = useAuth();
  const { isPremium, dailyProblemsRemaining, features } = usePremium();
  const { data: profile } = useProfile();
  const [visibleCount, setVisibleCount] = useState(20);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, solved, unsolved
  const [difficultyFilter, setDifficultyFilter] = useState("all"); // all, Easy, Medium, Hard
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  // Fetch problems from backend
  const { data: problemsData, isLoading: problemsLoading } = useQuery({
    queryKey: ["problems"],
    queryFn: getAllProblemsPublic,
  });

  const problems = problemsData?.problems || [];

  // Get unique categories from problems
  const categories = useMemo(() => {
    const cats = new Set(problems.map(p => p.category).filter(Boolean));
    return ["all", ...Array.from(cats)];
  }, [problems]);

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
      }
    };
    fetchSolvedIds();
  }, [getToken]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply filters
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = p.title?.toLowerCase().includes(query);
        const categoryMatch = p.category?.toLowerCase().includes(query);
        if (!titleMatch && !categoryMatch) return false;
      }
      // Status filter
      if (statusFilter === "solved" && !solvedIds.has(p.id)) return false;
      if (statusFilter === "unsolved" && solvedIds.has(p.id)) return false;
      // Difficulty filter
      if (difficultyFilter !== "all" && p.difficulty !== difficultyFilter) return false;
      // Category filter
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      return true;
    });
  }, [problems, searchQuery, statusFilter, difficultyFilter, categoryFilter, solvedIds]);

  // Count active filters
  const activeFilterCount = [
    statusFilter !== "all",
    difficultyFilter !== "all",
    categoryFilter !== "all"
  ].filter(Boolean).length;

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDifficultyFilter("all");
    setCategoryFilter("all");
  };

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

        {/* Daily Problem Limit Banner - Free Users Only */}
        {!isPremium && (
          <div className="alert mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <SparklesIcon className="size-5 text-primary" />
              <div>
                <span className="font-bold">{dailyProblemsRemaining}</span> new problems remaining today
                <span className="text-xs opacity-60 ml-2">(solved problems are unlimited)</span>
                {dailyProblemsRemaining === 0 && (
                  <span className="text-error ml-2">— Limit reached!</span>
                )}
              </div>
            </div>
            <Link to="/premium" className="btn btn-sm btn-primary gap-2">
              <CrownIcon className="size-4" />
              Upgrade for Unlimited
            </Link>
          </div>
        )}

        {/* SEARCH & FILTER TOOLBAR */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>

          {/* Filter Button & Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn gap-2 ${showFilters ? 'btn-primary' : 'btn-ghost bg-base-100 border border-base-300'}`}
            >
              <FilterIcon className="size-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="badge badge-sm badge-primary">{activeFilterCount}</span>
              )}
            </button>

            {/* Filter Dropdown Panel */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-base-100 rounded-xl shadow-2xl border border-base-300 p-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="space-y-4">
                  {/* Status Filter */}
                  <div>
                    <label className="text-xs font-bold uppercase text-base-content/50 mb-2 block">Status</label>
                    <div className="flex gap-2">
                      {["all", "solved", "unsolved"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`btn btn-sm flex-1 capitalize ${statusFilter === status
                            ? 'btn-primary'
                            : 'btn-ghost bg-base-200'
                            }`}
                        >
                          {status === "all" ? "All" : status === "solved" ? "✓ Solved" : "○ Unsolved"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="text-xs font-bold uppercase text-base-content/50 mb-2 block">Difficulty</label>
                    <div className="flex gap-2">
                      {["all", "Easy", "Medium", "Hard"].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficultyFilter(diff)}
                          className={`btn btn-sm flex-1 ${difficultyFilter === diff
                            ? diff === "Easy" ? "btn-success"
                              : diff === "Medium" ? "btn-warning"
                                : diff === "Hard" ? "btn-error"
                                  : "btn-primary"
                            : 'btn-ghost bg-base-200'
                            }`}
                        >
                          {diff === "all" ? "All" : diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-xs font-bold uppercase text-base-content/50 mb-2 block">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="select select-bordered select-sm w-full bg-base-200"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetFilters}
                    className="btn btn-ghost btn-sm w-full gap-2 text-base-content/60"
                  >
                    <XIcon className="size-4" />
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 px-4 py-2 bg-base-100 rounded-lg border border-base-300">
            <span className="text-base-content/60 text-sm">Showing</span>
            <span className="font-bold text-primary">{filteredProblems.length}</span>
            <span className="text-base-content/60 text-sm">problems</span>
          </div>
        </div>

        {/* Loading State */}
        {problemsLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            {/* No Results */}
            {filteredProblems.length === 0 ? (
              <div className="text-center py-12">
                <SearchIcon className="size-16 mx-auto text-base-content/20 mb-4" />
                <h3 className="text-xl font-bold mb-2">No problems found</h3>
                <p className="text-base-content/60 mb-4">Try adjusting your search or filters</p>
                <button onClick={resetFilters} className="btn btn-primary btn-sm">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* PROBLEMS LIST */}
                <div className="space-y-4">
                  {filteredProblems.slice(0, visibleCount).map((problem) => {
                    const isLocked = problem.isPremiumOnly && !isPremium;

                    return (
                      <Link
                        key={problem.id}
                        to={`/problem/${problem.id}`}
                        className={`card bg-base-100 hover:scale-[1.01] transition-transform ${isLocked ? 'opacity-75' : ''}`}
                      >
                        <div className="card-body">
                          <div className="flex items-center justify-between gap-4">
                            {/* LEFT SIDE */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`size-12 rounded-lg flex items-center justify-center ${isLocked ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
                                  {isLocked ? (
                                    <LockIcon className="size-6 text-amber-500" />
                                  ) : (
                                    <Code2Icon className="size-6 text-primary" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h2 className="text-xl font-bold">{problem.title || problem.id}</h2>
                                    {solvedIds.has(problem.id) && (
                                      <CheckCircle2Icon className="size-5 text-success" />
                                    )}
                                    <span className={`badge ${getDifficultyBadgeClass(problem.difficulty || "Easy")}`}>
                                      {problem.difficulty || "Easy"}
                                    </span>
                                    {problem.isPremiumOnly && (
                                      <span className="badge badge-warning gap-1">
                                        <CrownIcon className="size-3" />
                                        Premium
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm text-base-content/60">{problem.category || "General"}</p>
                                    {/* Company Tags - Premium Only */}
                                    {features.companyTags && problem.companyTags && problem.companyTags.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        <BuildingIcon className="size-3 text-base-content/40" />
                                        {problem.companyTags.slice(0, 3).map((tag, idx) => (
                                          <span key={idx} className="badge badge-ghost badge-xs">{tag}</span>
                                        ))}
                                        {problem.companyTags.length > 3 && (
                                          <span className="text-xs text-base-content/40">+{problem.companyTags.length - 3}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <p className="text-base-content/80 mb-3">{problem.description?.text || "No description available"}</p>
                            </div>
                            {/* RIGHT SIDE */}
                            <div className="flex items-center gap-2 text-primary">
                              {isLocked ? (
                                <>
                                  <span className="font-medium text-amber-500">Unlock</span>
                                  <CrownIcon className="size-5 text-amber-500" />
                                </>
                              ) : (
                                <>
                                  <span className="font-medium">Solve</span>
                                  <ChevronRightIcon className="size-5" />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* LOAD MORE BUTTON */}
                {visibleCount < filteredProblems.length && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 10)}
                      className="btn btn-outline btn-primary gap-2"
                    >
                      <ChevronRightIcon className="size-4 rotate-90" />
                      Load More Problems ({filteredProblems.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}

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
          </>
        )}
      </div>

      {/* Fixed Sidebar - Floating on right edge */}
      <ProblemSidebar
        streak={profile?.streak || 0}
        lastSolvedDate={profile?.lastSolvedDate}
        coins={profile?.coins || 0}
        timeTravelPasses={profile?.timeTravelPasses || 0}
        streakHistory={profile?.streakHistory || []}
        activeTimeTravelDate={profile?.activeTimeTravelDate}
      />
    </div>
  );
}

export default ProblemsPage;
