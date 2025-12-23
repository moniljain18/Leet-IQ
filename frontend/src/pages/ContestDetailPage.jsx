import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import {
    TrophyIcon,
    TimerIcon,
    CheckCircle2Icon,
    ChevronRightIcon,
    LockIcon,
    CalendarIcon,
    AlertCircleIcon,
    SparklesIcon,
    LogOutIcon,
    ArrowLeftIcon,
    UsersIcon,
    Code2Icon,
    EyeIcon,
    RotateCcwIcon,
    PartyPopperIcon
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import confetti from "canvas-confetti";
import { useProctoring } from "../hooks/useProctoring";
import ProctoringOverlay from "../components/ProctoringOverlay";

// Constants
const TIMER_LIMIT = 900;

function ContestDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showPostFlowModal, setShowPostFlowModal] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIMER_LIMIT);
    const [submissions, setSubmissions] = useState([]);
    const [ranking, setRanking] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);

    // Proctoring
    const { isLocked, strikeCount, unlock } = useProctoring(isJoined ? id : false);

    useEffect(() => {
        const fetchEssentialData = async () => {
            try {
                const userRes = await axiosInstance.get("/users/me");
                setCurrentUser(userRes.data);
            } catch (e) {
                console.error("Auth error:", e);
            }
        };
        fetchEssentialData();
    }, []);

    useEffect(() => {
        const fetchContestData = async () => {
            try {
                const response = await axiosInstance.get(`/contests/${id}`);
                setContest(response.data);
            } catch (error) {
                console.warn("Backend contest not found, using mock fallback.");
                const mockContest = {
                    _id: id,
                    title: id === "1" ? "Weekly Contest 482" : "Biweekly Contest 173",
                    description: "Solve all problems in 15 minutes. Speed is everything. Your rank is determined by the number of problems solved and the time taken.",
                    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
                    problems: [
                        { id: "two-sum", problemId: "two-sum", title: "Two Sum", score: 100, difficulty: "Easy" },
                        { id: "reverse-string", problemId: "reverse-string", title: "Reverse String", score: 200, difficulty: "Easy" },
                        { id: "maximum-subarray", problemId: "maximum-subarray", title: "Maximum Subarray", score: 300, difficulty: "Medium" },
                        { id: "container-with-most-water", problemId: "container-with-most-water", title: "Container With Most Water", score: 500, difficulty: "Medium" }
                    ],
                    status: "active"
                };
                setContest(mockContest);
            }
            setLoading(false);
        };
        fetchContestData();
    }, [id]);

    useEffect(() => {
        if (!contest) return;

        const registrationStatus = localStorage.getItem(`contest_registered_${id}`);
        const endedStatus = localStorage.getItem(`contest_ended_${id}`);
        const savedSession = localStorage.getItem(`contest_session_${id}`);

        if (registrationStatus === "true") setIsRegistered(true);
        if (endedStatus === "true" || contest.status === "past") setIsEnded(true);

        if (savedSession) {
            const { startTime, duration } = JSON.parse(savedSession);
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = duration - elapsed;

            if (remaining > 0 && endedStatus !== "true") {
                setTimeLeft(remaining);
                setIsJoined(true);
                fetchUserSubmissions();
            } else if (remaining <= 0 && endedStatus !== "true") {
                handleContestEnd();
            }
        }
        fetchRanking();
    }, [contest, currentUser]);

    const fetchRanking = async () => {
        try {
            const response = await axiosInstance.get(`/contests/${id}/leaderboard`);
            const leaderboardData = response.data;
            setLeaderboard(leaderboardData);

            const myIndex = leaderboardData.findIndex(entry => entry.userId === currentUser?._id);
            if (myIndex !== -1) {
                setRanking({
                    rank: myIndex + 1,
                    total: leaderboardData.length,
                    score: leaderboardData[myIndex].totalScore
                });
            } else {
                setRanking({ rank: '-', total: leaderboardData.length, score: 0 });
            }
        } catch (error) {
            console.error("Failed to fetch ranking:", error);
        }
    };

    const fetchUserSubmissions = async () => {
        if (!id || !contest) return;
        try {
            const response = await axiosInstance.get(`/contests/${id}/submissions`);
            setSubmissions(response.data);

            const solvedCount = new Set(response.data.filter(s => s.status === "Accepted").map(s => s.problemId)).size;

            // Completion logic: checks solved count against total problems in the contest
            if (solvedCount > 0 && solvedCount === contest.problems.length && !showCompletionModal && !isEnded) {
                handleCompletion();
            }
            fetchRanking(); // Also refresh ranking after submissions
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
        }
    };

    const handleCompletion = () => {
        fetchRanking(); // Ensure we have latest rank
        setShowCompletionModal(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    useEffect(() => {
        let timer;
        if (isJoined && timeLeft > 0 && !isEnded) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    const next = prev - 1;
                    if (next <= 0) {
                        handleContestEnd();
                        return 0;
                    }
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isJoined, timeLeft, isEnded]);

    useEffect(() => {
        let rankInterval;
        if (isJoined || isEnded) {
            rankInterval = setInterval(fetchRanking, 10000);
        }
        return () => clearInterval(rankInterval);
    }, [isJoined, isEnded, currentUser]);

    const handleContestEnd = () => {
        setIsJoined(false);
        setIsEnded(true);
        localStorage.setItem(`contest_ended_${id}`, "true");
        localStorage.removeItem(`contest_session_${id}`);
        toast.success("Contest session finished!");
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleRegisterClick = () => {
        if (isRegistered) {
            setShowCancelModal(true);
        } else {
            setShowRegisterModal(true);
        }
    };

    const confirmRegistration = () => {
        setIsRegistered(true);
        localStorage.setItem(`contest_registered_${id}`, "true");
        setShowRegisterModal(false);
        toast.success("Registration successful!");
    };

    const cancelRegistration = () => {
        setIsRegistered(false);
        localStorage.removeItem(`contest_registered_${id}`);
        setShowCancelModal(false);
        toast.success("Registration cancelled");
    };

    const handleJoinClick = () => {
        if (!isRegistered) {
            toast.error("Please register first");
            return;
        }
        const session = {
            startTime: Date.now(),
            duration: TIMER_LIMIT
        };
        localStorage.setItem(`contest_session_${id}`, JSON.stringify(session));
        localStorage.removeItem(`contest_ended_${id}`);
        setIsJoined(true);
        setIsEnded(false);
        setTimeLeft(TIMER_LIMIT);
        toast.success("Challenge started! 15 minutes on the clock.");
    };

    const confirmEndContest = () => {
        handleContestEnd();
        setShowEndModal(false);
        toast("Contest ended", { icon: "🏁" });
    };

    const handlePostFlowClick = () => setShowPostFlowModal(true);

    const reapplyForContest = () => {
        setShowPostFlowModal(false);
        handleJoinClick();
    };

    const checkSolutions = () => {
        setShowPostFlowModal(false);
        // This just lets the user see the page with "problems" unlocked
        setIsJoined(false); // They aren't in active timer mode
    };

    const addToCalendar = () => {
        if (!contest) return;
        const start = new Date(contest.startTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = new Date(contest.endTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.title)}&dates=${start}/${end}&details=${encodeURIComponent(contest.description)}&sf=true&output=xml`;
        window.open(url, "_blank");
    };

    if (loading || !contest) return (
        <div className="h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            <ProctoringOverlay
                isLocked={isLocked}
                strikeCount={strikeCount}
                onUnlock={unlock}
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* BACK BUTTON */}
                <button
                    onClick={() => navigate("/contests")}
                    className="btn btn-ghost btn-sm gap-2 mb-6 rounded-xl hover:bg-base-300"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Contests
                </button>

                <div className="card bg-base-100 shadow-xl overflow-hidden rounded-3xl mb-8">
                    <div className="p-8 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-black tracking-tight">{contest.title}</h1>
                                    <button
                                        onClick={addToCalendar}
                                        className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-primary"
                                        title="Add to Google Calendar"
                                    >
                                        <CalendarIcon className="size-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center text-sm">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-base-200 rounded-lg text-base-content/70">
                                        <TimerIcon className="size-4 text-primary" />
                                        {isJoined ? (
                                            <span className="font-mono font-bold text-primary">Time Remaning: {formatTime(timeLeft)}</span>
                                        ) : (
                                            <span>15 Minutes • 4 Problems</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-base-200 rounded-lg text-base-content/70">
                                        <UsersIcon className="size-4 text-secondary" />
                                        <span>1,4k+ Registered</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {contest.status === "active" && isRegistered && !isEnded && (
                                    <button
                                        onClick={handleJoinClick}
                                        className="btn btn-primary btn-lg rounded-2xl px-10 font-bold shadow-lg shadow-primary/20"
                                    >
                                        {isJoined ? "Continue Solution" : "Join Contest"}
                                    </button>
                                )}

                                {isEnded && (
                                    <button
                                        onClick={handlePostFlowClick}
                                        className="btn btn-secondary btn-lg rounded-2xl px-10 font-bold shadow-lg shadow-secondary/20"
                                    >
                                        Manage Participation
                                    </button>
                                )}

                                {isJoined && !isEnded && (
                                    <button
                                        onClick={() => setShowEndModal(true)}
                                        className="btn btn-error btn-lg rounded-2xl px-8 font-bold shadow-lg shadow-error/20 flex items-center gap-2"
                                    >
                                        <LogOutIcon className="size-5" />
                                        End
                                    </button>
                                )}

                                {!isJoined && !isEnded && (
                                    <button
                                        onClick={handleRegisterClick}
                                        className={`btn btn-lg rounded-2xl px-10 font-bold shadow-lg ${isRegistered
                                            ? "btn-outline border-primary text-primary"
                                            : "btn-primary shadow-primary/20"
                                            }`}
                                    >
                                        {isRegistered ? "Registered" : "Register"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="divider opacity-50"></div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Code2Icon className="size-5 text-primary" />
                                About this Contest
                            </h3>
                            <p className="text-base-content/80 leading-relaxed text-lg">
                                {contest.description}
                            </p>
                        </div>
                    </div>

                    <div className="bg-base-200 p-8 border-t border-base-300">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            {(isJoined || isEnded) ? <SparklesIcon className="size-5 text-primary" /> : <LockIcon className="size-5 text-base-content/40" />}
                            Problems List
                        </h3>

                        {/* LIVE STANDINGS TABLE */}
                        {(isJoined || isEnded) && leaderboard.length > 0 && (
                            <div className="card bg-base-100 border border-base-300 rounded-3xl overflow-hidden mb-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-base-200/50 px-8 py-4 border-b border-base-300 flex items-center justify-between">
                                    <h3 className="text-lg font-black flex items-center gap-2 text-base-content">
                                        <TrophyIcon className="size-5 text-warning" />
                                        Live Standings
                                    </h3>
                                    <span className="text-[10px] font-black opacity-30 uppercase tracking-widest italic animate-pulse">Real-time Updates</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr className="bg-base-300/30 text-base-content/40 border-b border-base-300">
                                                <th className="pl-8 py-3 font-black uppercase text-[10px] tracking-widest">Rank</th>
                                                <th className="py-3 font-black uppercase text-[10px] tracking-widest">User</th>
                                                <th className="py-3 font-black uppercase text-[10px] tracking-widest text-center">Solved</th>
                                                <th className="pr-8 py-3 text-right font-black uppercase text-[10px] tracking-widest">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-base-300">
                                            {leaderboard.slice(0, 10).map((user, idx) => (
                                                <tr
                                                    key={user.userId}
                                                    className={`hover:bg-primary/5 transition-colors ${user.userId === currentUser?._id ? 'bg-primary/10 font-bold italic' : ''}`}
                                                >
                                                    <td className="pl-8 py-4">
                                                        <div className={`size-7 rounded-lg flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-warning text-warning-content shadow-lg shadow-warning/20' :
                                                            idx === 1 ? 'bg-base-300 text-base-content' :
                                                                idx === 2 ? 'bg-orange-800 text-white' : 'bg-base-200 text-base-content/40'
                                                            }`}>
                                                            {idx + 1}
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="avatar">
                                                                <div className="w-8 h-8 rounded-lg ring-2 ring-base-300">
                                                                    <img
                                                                        src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                                        alt={user.name}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <span className="text-sm tracking-tight">{user.name}</span>
                                                            {user.userId === currentUser?._id && (
                                                                <span className="badge badge-primary badge-xs font-black py-2 rounded-md scale-90">YOU</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-center">
                                                        <span className="text-xs font-mono font-bold px-2 py-1 bg-base-300 rounded-md opacity-60">{user.count}</span>
                                                    </td>
                                                    <td className="pr-8 py-4 text-right">
                                                        <span className="text-lg font-black text-primary">{user.totalScore}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        <div className="grid gap-3">
                            {contest.problems.map((prob, idx) => (
                                <Link
                                    key={prob.id || prob.problemId}
                                    to={(isJoined || isEnded) ? `/problem/${prob.id || prob.problemId}?contestId=${contest._id}` : "#"}
                                    className={`flex items-center justify-between p-5 rounded-2xl bg-base-100 border border-base-300 transition-all ${(isJoined || isEnded)
                                        ? "hover:border-primary hover:shadow-xl hover:-translate-y-0.5"
                                        : "opacity-60 cursor-not-allowed"
                                        }`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="size-10 rounded-xl bg-base-200 flex items-center justify-center font-mono text-base-content/40 font-bold">
                                            Q{idx + 1}
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className={`text-lg font-bold ${(isJoined || isEnded) ? "text-base-content" : ""}`}>{prob.title}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`badge badge-sm font-bold ${getDifficultyBadgeClass(prob.difficulty)}`}>
                                                    {prob.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-primary text-xl">{prob.score}</div>
                                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Points</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {!(isJoined || isEnded) && (
                            <p className="text-center mt-6 text-sm text-base-content/50 italic flex items-center justify-center gap-2">
                                <LockIcon className="size-3" />
                                Problems will be revealed once you join the challenge.
                            </p>
                        )}
                    </div>
                </div>

                {isEnded && (
                    <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-2xl font-black">Your Contest Performance</h3>
                            <p className="opacity-70">Review your final rank and points earned in this challenge.</p>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-black text-primary">#{ranking?.rank || '-'}</div>
                                <div className="text-xs font-bold opacity-50 uppercase tracking-widest">Global Rank</div>
                            </div>
                            <div className="text-center border-l border-base-content/10 pl-8">
                                <div className="text-3xl font-black text-secondary">{ranking?.score || 0}</div>
                                <div className="text-xs font-bold opacity-50 uppercase tracking-widest">Total Score</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* COMPLETION MODAL */}
            {showCompletionModal && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl p-10 text-center space-y-6 shadow-2xl border-4 border-primary">
                        <div className="flex justify-center">
                            <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
                                <PartyPopperIcon className="size-10 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black">Phenomenal Job!</h3>
                            <p className="text-base-content/70 italic text-lg">"You've solved all the problems in record time!"</p>
                        </div>
                        <div className="bg-base-200 p-6 rounded-2xl grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-3xl font-black text-primary">#{ranking?.rank}</div>
                                <p className="text-xs font-bold opacity-40 uppercase">Current Rank</p>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-secondary">{ranking?.score}</div>
                                <p className="text-xs font-bold opacity-40 uppercase">Total Points</p>
                            </div>
                        </div>
                        <button onClick={() => setShowCompletionModal(false)} className="btn btn-primary btn-block rounded-2xl font-bold text-lg h-16 shadow-xl">
                            Back to Detail
                        </button>
                    </div>
                    <div className="modal-backdrop bg-base-300/80 backdrop-blur-md" onClick={() => setShowCompletionModal(false)}></div>
                </div>
            )}

            {/* POST FLOW MODAL */}
            {showPostFlowModal && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl p-8 space-y-6 shadow-2xl">
                        <h3 className="text-2xl font-black">Contest Finished</h3>
                        <p className="text-base-content/70">What would you like to do next? You can try to improve your score or review your solutions.</p>
                        <div className="grid gap-4">
                            <button onClick={reapplyForContest} className="btn h-20 rounded-2xl flex items-center justify-between px-6 bg-primary/10 border-primary text-primary hover:bg-primary/20 transition-all group">
                                <div className="text-left">
                                    <div className="font-black text-lg group-hover:translate-x-1 transition-transform">Reapply for Contest</div>
                                    <div className="text-xs opacity-60">Restart the 15-minute timer</div>
                                </div>
                                <RotateCcwIcon className="size-8" />
                            </button>
                            <button onClick={checkSolutions} className="btn h-20 rounded-2xl flex items-center justify-between px-6 bg-base-200 border-base-300 hover:bg-base-300 transition-all group">
                                <div className="text-left">
                                    <div className="font-black text-lg group-hover:translate-x-1 transition-transform">Check Solutions</div>
                                    <div className="text-xs opacity-60">Review and modify your code</div>
                                </div>
                                <EyeIcon className="size-8" />
                            </button>
                        </div>
                        <button onClick={() => setShowPostFlowModal(false)} className="btn btn-ghost btn-block rounded-xl">Cancel</button>
                    </div>
                    <div className="modal-backdrop bg-base-300/80 backdrop-blur-md" onClick={() => setShowPostFlowModal(false)}></div>
                </div>
            )}

            {/* REGISTER MODAL */}
            {showRegisterModal && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl p-8 border border-base-300 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <TrophyIcon className="size-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black">Register for Contest</h3>
                        </div>
                        <p className="py-4 text-lg text-base-content/80">
                            Do you want to now join the contest? You will receive updates and be eligible for ratings.
                        </p>
                        <div className="modal-action gap-3">
                            <button onClick={() => setShowRegisterModal(false)} className="btn btn-ghost rounded-xl">Cancel</button>
                            <button onClick={confirmRegistration} className="btn btn-primary rounded-xl px-8 font-bold">Register</button>
                        </div>
                    </div>
                    <div className="modal-backdrop bg-base-300/60 backdrop-blur-sm" onClick={() => setShowRegisterModal(false)}></div>
                </div>
            )}

            {/* END MODAL */}
            {showEndModal && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl p-8 border border-error/20 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 rounded-2xl bg-error/10 flex items-center justify-center">
                                <AlertCircleIcon className="size-6 text-error" />
                            </div>
                            <h3 className="text-2xl font-black">End Challenge?</h3>
                        </div>
                        <p className="py-4 text-lg text-base-content/80">
                            Your timer will stop and you can't make further submissions until you reapply. Are you sure?
                        </p>
                        <div className="modal-action gap-3">
                            <button onClick={() => setShowEndModal(false)} className="btn btn-ghost rounded-xl">Continue Solving</button>
                            <button onClick={confirmEndContest} className="btn btn-error text-white rounded-xl px-8 font-bold">End Contest</button>
                        </div>
                    </div>
                    <div className="modal-backdrop bg-base-300/60 backdrop-blur-sm" onClick={() => setShowEndModal(false)}></div>
                </div>
            )}
        </div>
    );
}

export default ContestDetailPage;
