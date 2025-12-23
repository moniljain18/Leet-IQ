import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
    TrophyIcon,
    UsersIcon,
    CalendarIcon,
    ChevronRightIcon,
    TrendingUpIcon,
    MedalIcon,
    SparklesIcon,
    SearchIcon,
    FilterIcon
} from "lucide-react";
import { Link } from "react-router";
import { format } from "date-fns";
import axiosInstance from "../lib/axios";

const CONTEST_TABS = ["All Contests", "Past Contests", "My Contests"];

function ContestsPage() {
    const [activeTab, setActiveTab] = useState("All Contests");
    const [contests, setContests] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Contests from Backend
                const response = await axiosInstance.get("/contests");

                // Sort by status: active first, then upcoming, then past
                const sortedContests = response.data.sort((a, b) => {
                    if (a.status === "active" && b.status !== "active") return -1;
                    if (a.status !== "active" && b.status === "active") return 1;
                    return new Date(b.startTime) - new Date(a.startTime);
                });

                // Add fallback difficulty if missing (since backend model might not have it explicitly on root)
                const mappedContests = sortedContests.map(c => ({
                    ...c,
                    difficulty: c.difficulty || "Hard", // Default or calculated
                    participants: c.participants || []
                }));

                setContests(mappedContests);

                // Initial fetch
                fetchRankings();

            } catch (error) {
                console.error("Failed to fetch contest data:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchRankings = async () => {
            try {
                const rankRes = await axiosInstance.get("/contests/1/leaderboard");
                setRankings(rankRes.data.map((user, idx) => ({
                    rank: idx + 1,
                    name: user.name,
                    score: user.totalScore,
                    avatar: user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                })));
            } catch (e) {
                console.error("Failed to fetch rankings:", e);
            }
        };

        fetchData();

        // Polling for rankings every 10 seconds
        const interval = setInterval(fetchRankings, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredContests = contests.filter(contest => {
        const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === "Past Contests") return matchesSearch && contest.status === "past";
        if (activeTab === "My Contests") {
            const isRegistered = localStorage.getItem(`contest_registered_${contest._id}`) === "true";
            return matchesSearch && isRegistered;
        }
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            {/* HERO BANNER */}
            <div className="bg-gradient-to-r from-primary/20 via-base-100 to-secondary/20 border-b border-base-300">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-black text-xs uppercase tracking-widest animate-pulse">
                        <SparklesIcon className="size-4" />
                        Next Live Contest in 2 Days
                    </div>
                    <h1 className="text-6xl font-black italic tracking-tighter">
                        CONTEST <span className="text-primary tracking-normal not-italic">HUB</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-base-content/60 text-lg">
                        Compete with the world's best developers in our weekly challenges.
                        Improve your coding speed, accuracy, and global ranking.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-12 gap-10">
                {/* MAIN CONTENT - CONTESTS LIST */}
                <div className="lg:col-span-8 space-y-8">
                    {/* TABS & SEARCH */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="tabs tabs-boxed bg-base-100 p-1.5 rounded-2xl border border-base-300">
                            {CONTEST_TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`tab tab-lg px-6 font-bold rounded-xl transition-all ${activeTab === tab ? "tab-active bg-primary text-primary-content shadow-lg shadow-primary/20" : ""
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-base-content/30 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search contests..."
                                className="input input-bordered pl-12 rounded-2xl w-full md:w-64 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* CONTEST CARDS */}
                    <div className="grid gap-6">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-48 w-full bg-base-100 rounded-3xl animate-pulse border border-base-300"></div>
                            ))
                        ) : filteredContests.length === 0 ? (
                            <div className="card bg-base-100 p-20 text-center border-2 border-dashed border-base-300">
                                <TrophyIcon className="size-16 mx-auto mb-4 opacity-10" />
                                <p className="text-lg opacity-40 font-bold">No contests found in this category.</p>
                            </div>
                        ) : (
                            filteredContests.map((contest) => (
                                <Link
                                    key={contest._id}
                                    to={`/contest/${contest._id}`}
                                    className="card bg-base-100 border border-base-300 hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all group rounded-3xl overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className={`w-full md:w-48 p-8 flex flex-col items-center justify-center gap-2 ${contest.status === 'active' ? 'bg-primary/5' : 'bg-base-200/50'
                                            }`}>
                                            <div className="text-xs uppercase font-black tracking-widest opacity-40">{format(new Date(contest.startTime), "MMM")}</div>
                                            <div className="text-4xl font-black">{format(new Date(contest.startTime), "dd")}</div>
                                            <div className={`badge ${contest.status === 'active' ? 'badge-primary' : 'badge-ghost opacity-50'} font-bold`}>
                                                {contest.status.toUpperCase()}
                                            </div>
                                        </div>

                                        <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{contest.title}</h3>
                                                    <ChevronRightIcon className="size-6 text-base-content/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-base-content/50 font-bold">
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-base-200 rounded-md">
                                                        <CalendarIcon className="size-4" />
                                                        {format(new Date(contest.startTime), "EEEE p 'GMT'XX")}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-base-200 rounded-md">
                                                        <MedalIcon className="size-4" />
                                                        {contest.difficulty}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-base-content/60 font-bold text-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <UsersIcon className="size-4" />
                                                        {contest.participants.length}+ Registered
                                                    </div>
                                                </div>
                                                {(localStorage.getItem(`contest_session_${contest._id}`) || localStorage.getItem(`contest_ended_${contest._id}`)) && (
                                                    <div className={`badge ${localStorage.getItem(`contest_ended_${contest._id}`) ? 'badge-secondary' : 'badge-success'} gap-1.5 font-black py-4 px-6 rounded-2xl shadow-lg`}>
                                                        <SparklesIcon className="size-3" />
                                                        {localStorage.getItem(`contest_ended_${contest._id}`) ? "FINISHED" : "CONTINUE"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* SIDEBAR - GLOBAL RANKINGS */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="card bg-base-100 border border-base-300 p-8 rounded-3xl shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <TrophyIcon size={120} />
                        </div>

                        <div className="flex items-center gap-3 mb-8 relative">
                            <div className="size-10 rounded-2xl bg-warning/20 flex items-center justify-center">
                                <TrophyIcon className="size-6 text-warning" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Global Rankings</h3>
                        </div>

                        <div className="space-y-4 relative">
                            {rankings.map((user) => (
                                <div key={user.rank} className="flex items-center justify-between p-4 bg-base-200 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-base-100 transition-all group cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-8 rounded-xl flex items-center justify-center font-black text-xs ${user.rank === 1 ? 'bg-warning text-warning-content' :
                                            user.rank === 2 ? 'bg-base-300 text-base-content' :
                                                'bg-orange-800 text-white'
                                            }`}>
                                            {user.rank}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-10 rounded-xl">
                                                    <img src={user.avatar} alt={user.name} />
                                                </div>
                                            </div>
                                            <span className="font-bold text-sm group-hover:text-primary transition-colors">{user.name}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-primary text-lg">{user.score.toLocaleString()}</div>
                                        <div className="text-[8px] uppercase font-black opacity-30 tracking-widest">Points</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-ghost btn-block mt-6 rounded-2xl font-bold flex items-center gap-2 group">
                            View Full Leaderboard
                            <ChevronRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="card bg-gradient-to-br from-primary to-secondary p-8 rounded-3xl text-primary-content shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <TrendingUpIcon size={160} />
                        </div>
                        <div className="relative space-y-4">
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase">Rating Upgrade</h3>
                            <p className="text-sm font-bold opacity-80 leading-relaxed">
                                Participate in Weekly contests to gain official Leet IQ ratings and unlock exclusive profile badges!
                            </p>
                            <button className="btn btn-white btn-block rounded-2xl shadow-xl font-black uppercase text-xs tracking-widest mt-4">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContestsPage;
