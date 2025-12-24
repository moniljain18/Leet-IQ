import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, LinkIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJoinByCode } from "../hooks/useSessions";
import { useProfile } from "../hooks/useAuth";
import { Flame } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();
  const [inviteCode, setInviteCode] = useState("");
  const joinByCodeMutation = useJoinByCode();
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const handleJoin = () => {
    if (!inviteCode.trim()) return;

    joinByCodeMutation.mutate(inviteCode.trim(), {
      onSuccess: (data) => {
        navigate(`/session/${data.session._id}`);
      },
    });
  };

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome back, {user?.firstName || "there"}!
              </h1>
              {profile?.streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full border border-orange-500/20 animate-bounce">
                  <Flame className="size-4 fill-orange-500" />
                  <span className="text-sm font-bold">{profile.streak} Day Streak!</span>
                </div>
              )}
            </div>
            <p className="text-xl text-base-content/60 ml-16">
              Ready to level up your coding skills?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 bg-base-100 p-1.5 rounded-2xl border border-primary/20 shadow-lg focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <div className="pl-3 text-base-content/40">
                <LinkIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter meeting code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="bg-transparent outline-none px-2 py-2 w-48 font-medium placeholder:text-base-content/30"
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
              <button
                onClick={handleJoin}
                disabled={!inviteCode.trim() || joinByCodeMutation.isPending}
                className="px-6 py-2.5 bg-primary text-primary-content rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joinByCodeMutation.isPending ? "Joining..." : "Join"}
              </button>
            </div>

            <div className="hidden sm:block h-8 w-[1px] bg-base-content/10 mx-2"></div>

            <button
              onClick={onCreateSession}
              className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl transition-all duration-200 hover:opacity-90 shadow-lg shadow-primary/20"
            >
              <div className="flex items-center gap-3 text-white font-bold text-lg">
                <ZapIcon className="w-6 h-6" />
                <span>Create Session</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
