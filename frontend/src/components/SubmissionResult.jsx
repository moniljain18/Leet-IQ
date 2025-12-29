import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import {
    ZapIcon,
    DatabaseIcon,
    ArrowLeftIcon,
    TrophyIcon,
    CheckCircle2Icon,
    AlertCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    Code2Icon,
    PencilLineIcon,
    SaveIcon
} from 'lucide-react';
import axiosInstance from '../lib/axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const SubmissionResult = ({ result, onBack }) => {
    const { getToken } = useAuth();
    const [showTestCases, setShowTestCases] = useState(false);
    const [notes, setNotes] = useState(result?.notes || "");
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    useEffect(() => {
        setNotes(result?.notes || "");
    }, [result]);

    if (!result) return null;

    const isAccepted = result.status === 'Accepted';
    const { benchmarks } = result;

    const handleSaveNotes = async () => {
        setIsSavingNotes(true);
        try {
            const token = await getToken();
            await axiosInstance.put(`/contests/submissions/${result._id || result.submissionId}/notes`, {
                notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Notes saved");
        } catch (error) {
            console.error("Failed to save notes:", error);
            toast.error("Failed to save notes");
        } finally {
            setIsSavingNotes(false);
        }
    };

    const renderStatCard = (title, value, unit, percentile, icon, colorClass) => (
        <div className={`bg-base-200/50 rounded-2xl p-6 border border-base-300 relative overflow-hidden group hover:border-${colorClass}/50 transition-all`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                {icon}
            </div>
            <p className="text-sm font-medium text-base-content/60 mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{value}</span>
                <span className="text-base-content/40 text-sm font-semibold uppercase">{unit}</span>
            </div>
            {percentile && (
                <div className="mt-4 flex items-center gap-2">
                    <div className={`badge badge-sm badge-${colorClass} gap-1 p-3`}>
                        <TrophyIcon className="size-3" />
                        <span>Beats {percentile}%</span>
                    </div>
                    <span className="text-xs text-base-content/40">of {result.language} users</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-base-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Submissions
                </button>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${isAccepted ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                    {isAccepted ? <CheckCircle2Icon className="size-5" /> : <AlertCircleIcon className="size-5" />}
                    {result.status}
                </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {renderStatCard(
                    "Runtime",
                    Math.ceil(result.runtime),
                    "ms",
                    benchmarks?.runtimePercentile,
                    <ZapIcon className="size-12" />,
                    "warning"
                )}
                {renderStatCard(
                    "Memory",
                    result.memory ? (
                        (result.memory / 1024 / 1024 < 1)
                            ? (result.memory / 1024).toFixed(1)
                            : (result.memory / 1024 / 1024).toFixed(1)
                    ) : "0.0",
                    result.memory / 1024 / 1024 < 1 ? "kb" : "mb",
                    benchmarks?.memoryPercentile,
                    <DatabaseIcon className="size-12" />,
                    "primary"
                )}
            </div>

            {/* Distribution Charts */}
            {isAccepted && benchmarks && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Runtime Distribution */}
                    <div className="bg-base-200/30 rounded-3xl p-6 border border-base-300">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <ZapIcon className="size-4 text-warning" />
                            Runtime Distribution
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={benchmarks.runtimeDistribution}>
                                    <XAxis
                                        dataKey="bin"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'currentColor', opacity: 0.4, fontSize: 12 }}
                                        unit="ms"
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'white', opacity: 0.05 }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-base-300 border border-white/10 p-2 rounded-lg text-xs shadow-xl">
                                                        <p className="font-bold">{payload[0].value} users</p>
                                                        <p className="opacity-60">{payload[0].payload.bin}ms</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {benchmarks.runtimeDistribution.map((entry, index) => {
                                            const binSize = benchmarks.runtimeBinSize || 5;
                                            const userBin = Math.floor(result.runtime / binSize) * binSize;
                                            const isUserBin = entry.bin === userBin;
                                            return (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={isUserBin ? 'var(--color-warning, #fbbd23)' : 'currentColor'}
                                                    opacity={isUserBin ? 1 : 0.2}
                                                />
                                            );
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Memory Distribution */}
                    <div className="bg-base-200/30 rounded-3xl p-6 border border-base-300">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <DatabaseIcon className="size-4 text-primary" />
                            Memory Distribution
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={benchmarks.memoryDistribution}>
                                    <XAxis
                                        dataKey="bin"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'currentColor', opacity: 0.4, fontSize: 10 }}
                                        tickFormatter={(v) => (v / 1024 / 1024).toFixed(1) + "MB"}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'white', opacity: 0.05 }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const mem = payload[0].payload.bin;
                                                const isKb = mem / 1024 / 1024 < 1;
                                                const displayMem = isKb ? (mem / 1024).toFixed(1) + "KB" : (mem / 1024 / 1024).toFixed(1) + "MB";
                                                return (
                                                    <div className="bg-base-300 border border-white/10 p-2 rounded-lg text-xs shadow-xl">
                                                        <p className="font-bold">{payload[0].value} users</p>
                                                        <p className="opacity-60">{displayMem}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {benchmarks.memoryDistribution.map((entry, index) => {
                                            const binSize = benchmarks.memoryBinSize || (1024 * 512);
                                            const userBin = Math.floor(result.memory / binSize) * binSize;
                                            const isUserBin = entry.bin === userBin;
                                            return (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={isUserBin ? 'var(--color-primary, #641ae3)' : 'currentColor'}
                                                    opacity={isUserBin ? 1 : 0.2}
                                                />
                                            );
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Code and Notes Section */}
            <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Code Block */}
                <div className="bg-base-200/50 rounded-3xl border border-base-300 flex flex-col overflow-hidden">
                    <div className="px-6 py-4 bg-base-300/30 border-b border-base-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code2Icon className="size-4 text-primary" />
                            <h3 className="font-bold text-sm">Submitted Code</h3>
                        </div>
                        <span className="badge badge-sm badge-outline opacity-50 uppercase tracking-tighter font-mono">{result.language}</span>
                    </div>
                    <div className="p-6 overflow-auto max-h-[400px]">
                        <pre className="font-mono text-xs leading-relaxed opacity-80 whitespace-pre-wrap">
                            <code>{result.code}</code>
                        </pre>
                    </div>
                </div>

                {/* Notes Block */}
                <div className="bg-base-200/50 rounded-3xl border border-base-300 flex flex-col overflow-hidden">
                    <div className="px-6 py-4 bg-base-300/30 border-b border-base-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PencilLineIcon className="size-4 text-secondary" />
                            <h3 className="font-bold text-sm">Personal Notes</h3>
                        </div>
                        <button
                            onClick={handleSaveNotes}
                            disabled={isSavingNotes}
                            className="btn btn-ghost btn-xs gap-1 hover:text-success"
                        >
                            {isSavingNotes ? <span className="loading loading-spinner loading-xs"></span> : <SaveIcon className="size-3" />}
                            {isSavingNotes ? "Saving..." : "Save"}
                        </button>
                    </div>
                    <textarea
                        className="p-6 bg-transparent resize-none flex-1 font-sans text-sm outline-none placeholder:opacity-20 min-h-[150px]"
                        placeholder="Explain your approach, time complexity, or thoughts here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
            </div>

        </div>
    );
};

export default SubmissionResult;
