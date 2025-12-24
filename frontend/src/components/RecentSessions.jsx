import { Code2, Clock, Users, Trophy, Loader, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function RecentSessions({ sessions = [], isLoading, pagination, onPageChange, onFilterChange, onSearchChange, searchQuery = "" }) {
  const [filterDays, setFilterDays] = useState(30);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Dynamic search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange?.(localSearch);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchQuery]);

  const handleFilterChange = (newDays) => {
    setFilterDays(newDays);
    if (onFilterChange) onFilterChange(1, itemsPerPage, newDays, localSearch);
  };

  const handlePageChange = (newPage) => {
    if (onPageChange) onPageChange(newPage, itemsPerPage, filterDays, localSearch);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    if (onPageChange) onPageChange(1, newLimit, filterDays, localSearch);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
  };

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalCount = pagination?.totalCount || 0;

  // Safe date formatter
  const formatDate = (dateStr) => {
    try {
      if (!dateStr) return "Unknown";
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="mt-8">
      {/* Header and Controls */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Past Sessions
            </h2>
            <p className="text-base-content/60 text-sm mt-1 font-medium">
              Review your coding history and track progress
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="join shadow-sm bg-base-100 rounded-lg border border-base-300">
              <button
                className={`join-item btn btn-sm ${filterDays === 7 ? 'btn-neutral' : 'btn-ghost'}`}
                onClick={() => handleFilterChange(7)}
              >
                7d
              </button>
              <button
                className={`join-item btn btn-sm ${filterDays === 30 ? 'btn-neutral' : 'btn-ghost'}`}
                onClick={() => handleFilterChange(30)}
              >
                30d
              </button>
              <button
                className={`join-item btn btn-sm ${filterDays === 90 ? 'btn-neutral' : 'btn-ghost'}`}
                onClick={() => handleFilterChange(90)}
              >
                90d
              </button>
            </div>

            <select
              className="select select-sm select-bordered w-full max-w-xs"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            >
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary">
            <Search className="w-5 h-5 opacity-40 group-focus-within:opacity-100" />
          </div>
          <input
            type="text"
            placeholder="Search sessions by problem name..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="input input-bordered w-full pl-12 pr-12 bg-base-100 shadow-sm focus:shadow-md focus:border-primary/50 transition-all rounded-xl"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle hover:bg-base-200"
              title="Clear search"
            >
              <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-base-300 rounded-2xl bg-base-200/50">
            <Loader className="w-10 h-10 animate-spin text-primary mb-3" />
            <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Loading History...</p>
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sessions.map((session) => (
              <div
                key={session._id}
                className={`group card relative transition-all duration-300 hover:-translate-y-1 ${session.status === "active"
                  ? "bg-success/10 border-success/30 hover:border-success/60"
                  : "bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-xl"
                  }`}
              >
                {session.status === "active" && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="badge badge-success gap-1 font-bold shadow-sm">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="card-body p-5 h-full flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${session.status === "active"
                        ? "bg-gradient-to-br from-success to-success/70"
                        : "bg-gradient-to-br from-primary to-secondary"
                        }`}
                    >
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-1 truncate">{session.problem}</h3>
                      <span className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm opacity-80 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(session.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {session.participant ? "2" : "1"} participant{session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-base-300 mt-auto">
                    <span className="text-xs font-semibold opacity-60 uppercase">{session.status}</span>
                    <Link
                      to={`/session/${session._id}`}
                      className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-base-300 rounded-2xl bg-base-200/30">
            <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
              {searchQuery ? <Search className="w-10 h-10 opacity-20" /> : <Trophy className="w-10 h-10 opacity-20" />}
            </div>
            <h3 className="text-xl font-bold mb-2 opacity-80">
              {searchQuery ? "No matches found" : "No sessions recorded"}
            </h3>
            <p className="text-base-content/50 max-w-sm text-center mb-6">
              {searchQuery
                ? `We couldn't find any sessions matching "${searchQuery}". Try a broader term.`
                : "You haven't completed any sessions in this period. Start a new challenge to track your progress!"}
            </p>
            {searchQuery && (
              <button onClick={handleClearSearch} className="btn btn-outline btn-sm">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-base-300/50">
          <p className="text-xs font-semibold text-base-content/40 uppercase tracking-widest order-2 sm:order-1">
            Page {currentPage} of {totalPages} • {totalCount} total results
          </p>

          <div className="join order-1 sm:order-2 shadow-sm">
            <button
              className="join-item btn btn-sm btn-outline gap-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <div className="join-item flex bg-base-100 border-y border-base-300 px-1 items-center">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = currentPage;
                if (totalPages <= 5) p = i + 1;
                else if (currentPage <= 3) p = i + 1;
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                else p = currentPage - 2 + i;

                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`btn btn-xs btn-ghost w-8 h-8 rounded-md ${currentPage === p ? 'bg-primary/10 text-primary font-bold' : ''
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              className="join-item btn btn-sm btn-outline gap-2"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentSessions;
