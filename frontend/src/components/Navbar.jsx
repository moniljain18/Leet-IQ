import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, Coins, Flame, Bell, Check } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
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
  const popupRef = useRef(null);

  const isCheckedInToday = () => {
    if (!profile?.dailyCheckInDate) return false;
    const lastCheckIn = new Date(profile.dailyCheckInDate);
    const today = new Date();
    return lastCheckIn.toDateString() === today.toDateString();
  };

  const handleRandomChallenge = () => {
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

          {/* User Stats: Bell -> Flame -> Profile -> Premium */}
          {profile && (
            <div className="flex items-center gap-4 ml-6 relative">
              {/* Notification Bell */}
              <button className="text-base-content/60 hover:text-base-content transition-colors p-2">
                <Bell className="size-5" />
              </button>

              {/* Streak Icon Cluster */}
              <div className="relative group/streak">
                <button
                  onClick={() => setShowPointsPopup(!showPointsPopup)}
                  className="flex items-center gap-1.5 text-base-content/60 hover:text-base-content transition-colors group p-2"
                  title="Your Stats & Daily Claim"
                >
                  <Flame className={`size-5 transition-transform group-hover:scale-110 ${profile.streak > 0 ? "text-orange-500 fill-orange-500 animate-pulse" : "text-base-content/20"}`} />
                  <span className="font-medium text-sm tabular-nums">{profile.streak || 0}</span>
                </button>

                {/* Points Popover (LeetCode Style) */}
                {showPointsPopup && (
                  <div
                    ref={popupRef}
                    className="absolute top-full right-0 mt-3 w-64 bg-base-100 rounded-2xl shadow-2xl border border-primary/20 p-5 animate-in slide-in-from-top-2 duration-200 z-[100]"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Your Points Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold opacity-70">Your Points</span>
                        <div className="flex items-center gap-1.5 text-yellow-500 font-black">
                          <Coins className="size-4 fill-yellow-500" />
                          <span>{profile.coins || 0}</span>
                        </div>
                      </div>

                      <div className="h-px bg-base-content/5" />

                      {/* Daily Claim Section */}
                      {!isCheckedInToday() ? (
                        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                          <p className="text-[11px] font-bold opacity-60 uppercase mb-2">Daily Reward Available</p>
                          <button
                            onClick={handleClaim}
                            disabled={isCheckingIn}
                            className="btn btn-primary btn-sm w-full rounded-lg font-bold gap-2"
                          >
                            {isCheckingIn ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <>Claim Daily Coin (+1)</>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-success bg-success/5 p-3 rounded-xl border border-success/10">
                          <Check className="size-4" />
                          <span className="text-xs font-bold">Claimed Today!</span>
                        </div>
                      )}

                      {/* Random Challenge Shortcut */}
                      <button
                        onClick={() => {
                          handleRandomChallenge();
                          setShowPointsPopup(false);
                        }}
                        className="text-xs font-bold text-primary hover:text-primary/80 transition-colors py-1 flex items-center gap-2"
                      >
                        <SparklesIcon className="size-3" />
                        Take a random challenge
                      </button>
                    </div>

                    {/* Arrow */}
                    <div className="absolute -top-1.5 right-4 w-3 h-3 bg-base-100 border-t border-l border-primary/20 rotate-45" />
                  </div>
                )}
              </div>

              {/* Clerk Profile Icon */}
              <div className="ml-1 hover:opacity-80 transition-opacity">
                <UserButton />
              </div>

              {/* Premium Button */}
              <button className="hidden sm:flex px-4 py-1.5 bg-[#FFF7E5] text-[#FFA116] rounded-full font-bold text-sm hover:bg-[#FFEEC2] transition-colors shadow-sm">
                Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
