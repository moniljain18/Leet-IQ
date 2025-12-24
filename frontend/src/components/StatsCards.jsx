import { TrophyIcon, UsersIcon, Coins, Flame, CalendarCheck } from "lucide-react";
import { useProfile } from "../hooks/useAuth";
import { useDailyCheckIn } from "../hooks/useRewards";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  const { data: profile } = useProfile();
  const { mutate: checkIn, isPending: checkingIn } = useDailyCheckIn();

  const isCheckedInToday = () => {
    if (!profile?.dailyCheckInDate) return false;
    const lastCheckIn = new Date(profile.dailyCheckInDate);
    const today = new Date();
    return lastCheckIn.toDateString() === today.toDateString();
  };
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="card bg-base-100 border-2 border-primary/20 hover:border-primary/40">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <UsersIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="badge badge-primary">Live</div>
          </div>
          <div className="text-4xl font-black mb-1">{activeSessionsCount}</div>
          <div className="text-sm opacity-60">Active Sessions</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className="card bg-base-100 border-2 border-secondary/20 hover:border-secondary/40">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-secondary/10 rounded-2xl">
              <TrophyIcon className="w-7 h-7 text-secondary" />
            </div>
          </div>
          <div className="text-4xl font-black mb-1">{recentSessionsCount}</div>
          <div className="text-sm opacity-60">Total Sessions Completed</div>
        </div>
      </div>

      {/* Daily Check-in & Rewards */}
      <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
        <div className="card-body">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className={`w-6 h-6 ${profile?.streak > 0 ? "text-orange-500 fill-orange-500 animate-pulse" : "text-base-content/20"}`} />
              <div className="text-2xl font-black">{profile?.streak || 0}</div>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <div className="text-2xl font-black">{profile?.coins || 0}</div>
            </div>
          </div>

          <button
            className={`btn btn-sm mt-2 font-bold ${isCheckedInToday() ? "btn-disabled bg-success/20 text-success" : "btn-primary"}`}
            disabled={isCheckedInToday() || checkingIn}
            onClick={() => checkIn()}
          >
            {checkingIn ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : isCheckedInToday() ? (
              <>Checked In Today</>
            ) : (
              <>Daily Check-in (+1 Coin)</>
            )}
          </button>
          <div className="text-[10px] opacity-40 uppercase tracking-tighter text-center mt-1">
            Solve problems daily to grow your streak!
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
