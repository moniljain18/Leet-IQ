import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { getAllProblemsPublic } from '../api/problems';
import { GiftIcon, XIcon } from 'lucide-react';

/**
 * StreakCalendar - Calendar component showing streak progress
 * Features:
 * - Current month calendar with day markers
 * - Countdown timer until midnight (streak deadline)
 * - Orange dots on active streak days
 * - Clickable past dates for time travel (with confirmation modal)
 */
function StreakCalendar({ streak = 0, lastSolvedDate, streakHistory = [], timeTravelPasses = 0, activeTimeTravelDate }) {
    const [timeLeft, setTimeLeft] = useState('');
    const [currentDate] = useState(new Date());
    const [isStartingTimeTravel, setIsStartingTimeTravel] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();
    const { getToken } = useAuth();

    // Fetch problems for random selection
    const { data: problemsData } = useQuery({
        queryKey: ["problems"],
        queryFn: getAllProblemsPublic,
    });

    // Calculate time until midnight
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);

            const diff = midnight - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} left`
            );
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    // Get calendar data for current month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = currentDate.getDate();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Check if a date is in streakHistory (solved that day)
    const isDaySolved = (dayOfMonth) => {
        // First check streakHistory if available
        if (streakHistory && streakHistory.length > 0) {
            return streakHistory.some(d => {
                const historyDate = new Date(d);
                return historyDate.getMonth() === month &&
                    historyDate.getFullYear() === year &&
                    historyDate.getDate() === dayOfMonth;
            });
        }

        // Fallback: If no streakHistory, use lastSolvedDate to show at least that day
        // This shows the dot for the last solved day even if streak is 0
        if (lastSolvedDate) {
            const lastSolved = new Date(lastSolvedDate);
            if (lastSolved.getMonth() === month &&
                lastSolved.getFullYear() === year &&
                lastSolved.getDate() === dayOfMonth) {
                return true;
            }

            // If streak > 0, also show previous consecutive days
            if (streak > 0) {
                for (let i = 0; i < streak; i++) {
                    const streakDay = new Date(lastSolved);
                    streakDay.setDate(lastSolved.getDate() - i);
                    if (streakDay.getMonth() === month &&
                        streakDay.getFullYear() === year &&
                        streakDay.getDate() === dayOfMonth) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    // Determine if a date is clickable for time travel
    const isDateClickable = (dayOfMonth) => {
        if (!dayOfMonth) return false;
        if (timeTravelPasses <= 0) return false;

        const dateToCheck = new Date(year, month, dayOfMonth);
        const todayDate = new Date(year, month, today);

        if (dateToCheck >= todayDate) return false;
        if (isDaySolved(dayOfMonth)) return false;

        return true;
    };

    // Handle clicking on a past date - show confirmation modal
    const handleDateClick = (dayOfMonth) => {
        if (!isDateClickable(dayOfMonth)) return;

        const targetDate = new Date(year, month, dayOfMonth);
        setSelectedDate(targetDate);
        setShowConfirmModal(true);
    };

    // Confirm and start time travel
    const confirmTimeTravel = async () => {
        if (!selectedDate) return;

        setIsStartingTimeTravel(true);
        try {
            const token = await getToken();
            await axiosInstance.post('/users/start-time-travel',
                { date: selectedDate.toISOString() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Get a random problem
            const problems = problemsData?.problems || [];
            if (problems.length === 0) {
                toast.error('No problems available');
                setShowConfirmModal(false);
                return;
            }

            const randomProblem = problems[Math.floor(Math.random() * problems.length)];

            toast.success(`Time traveling to ${selectedDate.toLocaleDateString()}!`);
            setShowConfirmModal(false);

            // Navigate to the random problem
            navigate(`/problem/${randomProblem.id}`);
        } catch (error) {
            console.error('Time travel error:', error);
            toast.error(error.response?.data?.message || 'Failed to start time travel');
        } finally {
            setIsStartingTimeTravel(false);
        }
    };

    // Cancel time travel
    const cancelConfirmation = () => {
        setShowConfirmModal(false);
        setSelectedDate(null);
    };

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Generate calendar grid
    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    return (
        <>
            <div className="bg-base-200/50 rounded-2xl p-4 backdrop-blur-sm border border-base-300/50">
                {/* Active Time Travel Banner */}
                {activeTimeTravelDate && (
                    <div className="mb-3 p-2 bg-amber-500/20 border border-amber-500/50 rounded-lg text-center">
                        <span className="text-amber-400 text-sm font-medium">
                            🕐 Time traveling to {new Date(activeTimeTravelDate).toLocaleDateString()}
                        </span>
                        <p className="text-xs text-amber-400/70">Solve any problem to complete!</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-base-content">Day {streak || today}</span>
                            <span className="text-sm text-base-content/50">{timeLeft}</span>
                        </div>
                        {timeTravelPasses > 0 && (
                            <p className="text-xs text-amber-400 mt-1">
                                🎫 {timeTravelPasses} pass{timeTravelPasses > 1 ? 'es' : ''} - tap a missed date
                            </p>
                        )}
                    </div>
                    <div className="relative">
                        <div className="w-12 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex flex-col items-center justify-center shadow-lg shadow-cyan-500/30">
                            <span className="text-2xl font-bold text-white">{today}</span>
                            <span className="text-[10px] text-white/80 uppercase -mt-1">{monthNames[month]}</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-base-100 rounded-bl-lg"></div>
                    </div>
                </div>

                {/* Day names header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day, idx) => (
                        <div key={idx} className="text-center text-xs text-base-content/50 font-medium py-1">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                        const isToday = day === today;
                        const isSolved = isDaySolved(day);
                        const isClickable = isDateClickable(day);
                        const isFuture = day && new Date(year, month, day) > new Date(year, month, today);

                        return (
                            <div key={idx} className="relative flex flex-col items-center py-1">
                                {day && (
                                    <>
                                        <button
                                            onClick={() => handleDateClick(day)}
                                            disabled={!isClickable || isStartingTimeTravel}
                                            className={`
                                                w-8 h-8 flex items-center justify-center text-sm rounded-full
                                                transition-all duration-200
                                                ${isToday
                                                    ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/40'
                                                    : isClickable
                                                        ? 'hover:bg-amber-500/30 hover:text-amber-400 cursor-pointer border border-dashed border-amber-500/50'
                                                        : isFuture
                                                            ? 'text-base-content/30 cursor-not-allowed'
                                                            : 'text-base-content/80'
                                                }
                                            `}
                                        >
                                            {day}
                                        </button>
                                        {isSolved && (
                                            <div className={`
                                                absolute -bottom-0.5 w-1.5 h-1.5 rounded-full
                                                ${isToday ? 'bg-white' : 'bg-orange-500'}
                                            `}></div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && selectedDate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelConfirmation} />

                    <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-base-300 to-base-200 px-6 py-8 text-center">
                            <div className="w-24 h-24 mx-auto mb-4 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl rotate-45 transform scale-75"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-base-content mb-1">Travel Back in Time to</h2>
                            <h3 className="text-2xl font-bold text-base-content">
                                Finish <span className="text-amber-400">1</span> Missing Challenge
                            </h3>
                            <p className="text-sm text-base-content/60 mt-2">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <p className="text-base-content text-center">
                                Are you sure you want to use a <span className="font-bold text-amber-400">Time Travel Pass</span>?
                            </p>

                            <div className="space-y-2 text-sm text-base-content/70">
                                <p>• You'll be redirected to a random problem</p>
                                <p>• Solving it will mark {selectedDate.toLocaleDateString()} as complete</p>
                                <p>• This will cost <span className="font-bold text-amber-400">1 pass</span></p>
                            </div>

                            <div className="text-center text-sm text-base-content/50">
                                Passes remaining: <span className="font-bold text-primary">{timeTravelPasses}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 p-6 pt-0">
                            <button onClick={cancelConfirmation} disabled={isStartingTimeTravel} className="btn btn-ghost flex-1">
                                Cancel
                            </button>
                            <button onClick={confirmTimeTravel} disabled={isStartingTimeTravel} className="btn btn-warning flex-1 gap-2">
                                {isStartingTimeTravel ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <>Redeem <GiftIcon className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default StreakCalendar;
