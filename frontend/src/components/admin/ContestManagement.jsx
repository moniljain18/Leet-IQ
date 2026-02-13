import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllContests, createContest, updateContest, deleteContest, getAllProblems } from "../../api/admin";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../ConfirmModal";

function ContestManagement() {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingContest, setEditingContest] = useState(null);
    const [selectedContest, setSelectedContest] = useState(null);
    const [selectedProblems, setSelectedProblems] = useState([]);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["adminContests"],
        queryFn: getAllContests,
    });

    const { data: problemsData, isLoading: problemsLoading } = useQuery({
        queryKey: ["adminProblems"],
        queryFn: getAllProblems,
    });

    const createMutation = useMutation({
        mutationFn: createContest,
        onSuccess: () => {
            toast.success("Contest created successfully");
            queryClient.invalidateQueries(["adminContests"]);
            setShowModal(false);
            setEditingContest(null);
            setSelectedProblems([]);
        },
        onError: (error) => {
            console.error("Contest creation error:", error);
            toast.error(error.response?.data?.message || "Failed to create contest");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ contestId, data }) => updateContest(contestId, data),
        onSuccess: () => {
            toast.success("Contest updated successfully");
            queryClient.invalidateQueries(["adminContests"]);
            setShowModal(false);
            setEditingContest(null);
            setSelectedProblems([]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update contest");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteContest,
        onSuccess: () => {
            toast.success("Contest deleted successfully");
            queryClient.invalidateQueries(["adminContests"]);
            setShowDeleteModal(false);
            setSelectedContest(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete contest");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const contestData = {
            name: formData.get("name"),
            description: formData.get("description"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            problems: selectedProblems,
            isPublic: formData.get("isPublic") === "on",
        };

        // Validation
        if (!contestData.name || contestData.name.trim() === "") {
            toast.error("Contest name is required");
            return;
        }
        if (!contestData.startDate) {
            toast.error("Start date is required");
            return;
        }
        if (!contestData.endDate) {
            toast.error("End date is required");
            return;
        }
        if (new Date(contestData.endDate) <= new Date(contestData.startDate)) {
            toast.error("End date must be after start date");
            return;
        }
        if (selectedProblems.length === 0) {
            toast.error("Please select at least one problem");
            return;
        }

        console.log("Submitting contest data:", contestData);

        if (editingContest) {
            updateMutation.mutate({ contestId: editingContest._id, data: contestData });
        } else {
            createMutation.mutate(contestData);
        }
    };

    const handleEdit = (contest) => {
        setEditingContest(contest);
        setSelectedProblems(contest.problems || []);
        setShowModal(true);
    };

    const handleDelete = (contest) => {
        setSelectedContest(contest);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        deleteMutation.mutate(selectedContest._id);
    };

    const toggleProblem = (problemId) => {
        setSelectedProblems(prev =>
            prev.includes(problemId)
                ? prev.filter(id => id !== problemId)
                : [...prev, problemId]
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Contest Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingContest(null);
                        setSelectedProblems([]);
                        setShowModal(true);
                    }}
                >
                    <PlusIcon className="size-5" />
                    Create Contest
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Problems</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.contests?.map((contest) => (
                                <tr key={contest._id}>
                                    <td className="font-semibold">{contest.name}</td>
                                    <td>{new Date(contest.startDate).toLocaleString()}</td>
                                    <td>{new Date(contest.endDate).toLocaleString()}</td>
                                    <td>{contest.problems?.length || 0}</td>
                                    <td>
                                        <span
                                            className={`badge ${new Date(contest.endDate) > new Date()
                                                ? "badge-success"
                                                : "badge-neutral"
                                                }`}
                                        >
                                            {new Date(contest.endDate) > new Date() ? "Active" : "Ended"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-info btn-xs"
                                                onClick={() => handleEdit(contest)}
                                            >
                                                <EditIcon className="size-3" />
                                            </button>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleDelete(contest)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <TrashIcon className="size-3" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-lg mb-4">
                            {editingContest ? "Edit Contest" : "Create New Contest"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Contest Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input input-bordered"
                                    defaultValue={editingContest?.name}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    name="description"
                                    className="textarea textarea-bordered"
                                    defaultValue={editingContest?.description}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Start Date</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        className="input input-bordered"
                                        defaultValue={
                                            editingContest
                                                ? new Date(editingContest.startDate)
                                                    .toISOString()
                                                    .slice(0, 16)
                                                : ""
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">End Date</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        className="input input-bordered"
                                        defaultValue={
                                            editingContest
                                                ? new Date(editingContest.endDate)
                                                    .toISOString()
                                                    .slice(0, 16)
                                                : ""
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Select Problems ({selectedProblems.length} selected)
                                    </span>
                                </label>
                                {problemsLoading ? (
                                    <div className="flex justify-center py-4">
                                        <span className="loading loading-spinner"></span>
                                    </div>
                                ) : (
                                    <div className="border border-base-300 rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                                        {problemsData?.problems?.map((problem) => (
                                            <label
                                                key={problem.id}
                                                className="flex items-center gap-3 p-2 hover:bg-base-200 rounded cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-primary"
                                                    checked={selectedProblems.includes(problem.id)}
                                                    onChange={() => toggleProblem(problem.id)}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-semibold">{problem.title || problem.id}</p>
                                                    <p className="text-sm text-base-content/60">
                                                        {problem.difficulty} • {problem.category}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Public Contest</span>
                                    <input
                                        type="checkbox"
                                        name="isPublic"
                                        className="checkbox"
                                        defaultChecked={editingContest?.isPublic ?? true}
                                    />
                                </label>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingContest(null);
                                        setSelectedProblems([]);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={createMutation.isLoading || updateMutation.isLoading}
                                >
                                    {createMutation.isLoading || updateMutation.isLoading
                                        ? "Saving..."
                                        : editingContest
                                            ? "Update"
                                            : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Contest Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedContest(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Contest"
                message={`Are you sure you want to delete "${selectedContest?.name}"? All submissions will also be deleted.`}
                confirmText="Delete Contest"
                variant="error"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}

export default ContestManagement;
