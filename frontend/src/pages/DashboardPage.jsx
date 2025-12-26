import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import { useProfile } from "../hooks/useAuth";
import { useDailyCheckIn } from "../hooks/useRewards";
import { useEffect } from "react";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const { data: profile } = useProfile();

  const [recentSessionPage, setRecentSessionPage] = useState(1);
  const [recentSessionLimit, setRecentSessionLimit] = useState(9);
  const [recentSessionDays, setRecentSessionDays] = useState(30);
  const [recentSessionSearch, setRecentSessionSearch] = useState("");

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions(
    recentSessionPage,
    recentSessionLimit,
    recentSessionDays,
    recentSessionSearch
  );

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
        onError: (error) => {
          console.error("Failed to create session:", error);
          alert("Failed to create session. Check console for details.");
        }
      }
    );
  };

  const handleRecentSessionPageChange = (page, limit, days, search) => {
    setRecentSessionPage(page);
    setRecentSessionLimit(limit);
    setRecentSessionDays(days);
    if (search !== undefined) setRecentSessionSearch(search);
  };

  const handleRecentSessionSearch = (search) => {
    setRecentSessionSearch(search);
    setRecentSessionPage(1); // Reset to page 1 when searching
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const recentSessionsPagination = recentSessionsData?.pagination;

  const isUserInSession = (session) => {
    if (!user || !user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessionsPagination?.totalCount || 0}
            />
            <div className="lg:col-span-2">
              <ActiveSessions
                sessions={activeSessions}
                isLoading={loadingActiveSessions}
                isUserInSession={isUserInSession}
              />
            </div>
          </div>

          <RecentSessions
            sessions={recentSessions}
            isLoading={loadingRecentSessions}
            pagination={recentSessionsPagination}
            onPageChange={handleRecentSessionPageChange}
            onFilterChange={handleRecentSessionPageChange}
            onSearchChange={handleRecentSessionSearch}
            searchQuery={recentSessionSearch}
          />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />

      {/* DailyClaimModal is now replaced by the Navbar popover system as per user feedback */}
    </>
  );
}

export default DashboardPage;
