import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, Coins, Flame, Bell, Check } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useProfile } from "../hooks/useAuth";
import { PROBLEMS } from "../data/problems";
import toast from "react-hot-toast";
import { useDailyCheckIn } from "../hooks/useRewards";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { mutate: dailyCheckIn, isPending: isCheckingIn } = useDailyCheckIn();
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const popupRef = useRef(null);
  const streakPopupRef = useRef(null);

  useEffect(() => {
    if (profile) {
      console.log("[Navbar] Current Profile Stats - Streak:", profile.streak, "Coins:", profile.coins);
    }
  }, [profile]);

  const isCheckedInToday = () => {
    if (!profile?.dailyCheckInDate) return false;
    const lastCheckIn = new Date(profile.dailyCheckInDate);
    const today = new Date();
    return lastCheckIn.toDateString() === today.toDateString();
  };

  const isStreakCompletedToday = () => {
    if (!profile?.lastSolvedDate) return false;
    const lastSolved = new Date(profile.lastSolvedDate);
    const today = new Date();
    return lastSolved.toDateString() === today.toDateString();
  };

  const handleRandomChallenge = () => {
    if (isStreakCompletedToday()) {
      toast.success("Daily Streak Completed! You're all set for today.");
      return;
    }
    const problemIds = Object.keys(PROBLEMS);
    const randomId = problemIds[Math.floor(Math.random() * problemIds.length)];
    navigate(`/problem/${randomId}`);
    toast.success("Random Challenge Loaded! Solve it to maintain your streak.");
  };

  const handleClaim = (e) => {
    e.stopPropagation();
    dailyCheckIn(null, {
      onSuccess: () => {
        // Popover stays open for a bit or just closes
      }
    });

  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPointsPopup(false);
      }
      if (streakPopupRef.current && !streakPopupRef.current.contains(event.target)) {
        setShowStreakPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log(location);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg ">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              LEET IQ
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${isActive("/problems")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${isActive("/dashboard")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          {/* CONTESTS PAGE LINK */}
          <Link
            to={"/contests"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${isActive("/contests")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <SparklesIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Contests</span>
            </div>
          </Link>

          {/* Stats & Actions Area */}
          <div className="flex items-center gap-4 ml-6 relative">
            {/* 1. Notification Bell */}
            <button className="text-base-content/60 hover:text-base-content transition-colors p-2">
              <Bell className="size-5" />
            </button>

            {/* 2. Coins Section with Hover Popover */}
            <div
              className="relative py-2 px-1 group/coins"
              onMouseEnter={() => setShowPointsPopup(true)}
              onMouseLeave={() => setShowPointsPopup(false)}
            >
              <div className="flex items-center gap-1.5 text-base-content/60 group-hover/coins:text-base-content transition-colors cursor-pointer">
                <Coins className="size-5 text-yellow-500 fill-yellow-500" />
                <span
                  key={profile?.coins}
                  className="font-medium text-sm tabular-nums animate-in zoom-in duration-300"
                >
                  {profile?.coins || 0}
                </span>
              </div>

              {/* LeetCode Style Your Points Popover */}
              {showPointsPopup && (
                <div className="absolute top-full right-0 mt-0 pt-2 w-56 z-[100] animate-in fade-in zoom-in duration-150">
                  <div className="bg-[#282828] text-white rounded-lg shadow-2xl border border-white/10 p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold opacity-70">Your Points</span>
                        <div className="flex items-center gap-1.5 font-bold text-yellow-500">
                          <Coins className="size-4 fill-yellow-500" />
                          <span>{profile?.coins || 0}</span>
                        </div>
                      </div>

                      {/* Daily Claim inside Popover */}
                      {!isCheckedInToday() && (
                        <div className="pt-2 border-t border-white/10">
                          <button
                            onClick={handleClaim}
                            disabled={isCheckingIn}
                            className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
                          >
                            {isCheckingIn ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <>Claim Daily Reward (+1)</>
                            )}
                          </button>
                        </div>
                      )}

                      {isCheckedInToday() && (
                        <div className="pt-2 border-t border-white/10 text-center">
                          <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Already Claimed Today</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-1 right-12 w-2 h-2 bg-[#282828] rotate-45 border-t border-l border-white/10" />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Streak Icon (Button for Random Challenge) with dedicated Popover */}
            <div
              className="relative py-2 px-1 group/streak"
              onMouseEnter={() => setShowStreakPopup(true)}
              onMouseLeave={() => setShowStreakPopup(false)}
              ref={streakPopupRef}
            >
              <button
                onClick={handleRandomChallenge}
                disabled={isStreakCompletedToday()}
                className={`flex items-center gap-1.5 transition-colors group p-1 ${isStreakCompletedToday() ? "cursor-default text-base-content" : "text-base-content/60 hover:text-base-content"}`}
              >
                <Flame className={`size-5 transition-transform ${!isStreakCompletedToday() ? "group-hover:scale-110" : ""} ${profile?.streak > 0 ? "text-orange-500 fill-orange-500" : "text-base-content/20"}`} />
                <span
                  key={profile?.streak}
                  className={`font-medium text-sm tabular-nums ${profile?.streak > 0 ? "text-orange-500" : ""}`}
                >
                  {profile?.streak || 0}
                </span>
              </button>

              {/* Dedicated Streak Popover */}
              {showStreakPopup && (
                <div className="absolute top-full right-0 mt-0 pt-2 w-56 z-[100] animate-in fade-in zoom-in duration-150">
                  <div className="bg-[#282828] text-white rounded-lg shadow-2xl border border-white/10 p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold opacity-70">Daily Streak</span>
                        <div className="flex items-center gap-1.5 font-bold text-orange-500">
                          <Flame className="size-4 fill-orange-500" />
                          <span>{profile?.streak || 0}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        {isStreakCompletedToday() ? (
                          <div className="bg-green-500/10 text-green-400 p-3 rounded-lg text-xs font-medium space-y-1">
                            <div className="flex items-center gap-2">
                              <Check className="size-3" />
                              <span className="font-bold">Streak Completed!</span>
                            </div>
                            <p className="opacity-70">You're all set for today. Come back tomorrow!</p>
                          </div>
                        ) : (
                          <div className="bg-orange-500/10 text-orange-400 p-3 rounded-lg text-xs font-medium space-y-1">
                            <div className="flex items-center gap-2">
                              <Flame className="size-3" />
                              <span className="font-bold">Daily Streak Pending</span>
                            </div>
                            <p className="opacity-70">Solve any problem to maintain your {profile?.streak || 0} day streak.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute -top-1 right-8 w-2 h-2 bg-[#282828] rotate-45 border-t border-l border-white/10" />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Clerk Profile Icon */}
            <div className="flex items-center">
              <SignedIn>
                <div className="hover:opacity-80 transition-opacity">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn btn-ghost btn-sm font-bold text-primary">Log In</button>
                </SignInButton>
              </SignedOut>
            </div>

            {/* 5. Premium Button */}
            <button className="hidden sm:flex px-4 py-1.5 bg-[#FFF7E5] text-[#FFA116] rounded-full font-bold text-sm hover:bg-[#FFEEC2] transition-colors shadow-sm">
              Premium
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
