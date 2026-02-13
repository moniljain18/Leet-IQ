import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProblems, createProblem, updateProblem, deleteProblem } from "../../api/admin";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../ConfirmModal";

function ProblemManagement() {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingProblem, setEditingProblem] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["adminProblems"],
        queryFn: getAllProblems,
    });

    const createMutation = useMutation({
        mutationFn: createProblem,
        onSuccess: () => {
            toast.success("Problem created successfully");
            queryClient.invalidateQueries(["adminProblems"]);
            queryClient.invalidateQueries(["problems"]);
            setShowModal(false);
            setEditingProblem(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create problem");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateProblem(id, data),
        onSuccess: () => {
            toast.success("Problem updated successfully");
            queryClient.invalidateQueries(["adminProblems"]);
            queryClient.invalidateQueries(["problems"]);
            setShowModal(false);
            setEditingProblem(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update problem");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProblem,
        onSuccess: () => {
            toast.success("Problem deleted successfully");
            queryClient.invalidateQueries(["adminProblems"]);
            queryClient.invalidateQueries(["problems"]);
            setShowDeleteModal(false);
            setSelectedProblem(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete problem");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Parse JSON fields
        let testCases, examples, constraints, notes, hints, tags;
        try {
            testCases = JSON.parse(formData.get("testCases"));
            examples = JSON.parse(formData.get("examples") || "[]");
            constraints = JSON.parse(formData.get("constraints") || "[]");
            notes = JSON.parse(formData.get("notes") || "[]");
            hints = JSON.parse(formData.get("hints") || "[]");
            tags = JSON.parse(formData.get("tags") || "[]");
        } catch (error) {
            toast.error("Invalid JSON format in one of the fields");
            return;
        }

        const problemData = {
            id: formData.get("id"),
            title: formData.get("title"),
            difficulty: formData.get("difficulty"),
            category: formData.get("category"),
            description: {
                text: formData.get("descriptionText"),
                notes: notes,
            },
            examples,
            constraints,
            functionName: formData.get("functionName"),
            testCases,
            timeLimit: parseInt(formData.get("timeLimit")) || 2000,
            memoryLimit: parseInt(formData.get("memoryLimit")) || 128,
            hints,
            tags,
        };

        if (editingProblem) {
            updateMutation.mutate({ id: editingProblem.id, data: problemData });
        } else {
            createMutation.mutate(problemData);
        }
    };

    const handleEdit = (problem) => {
        setEditingProblem(problem);
        setShowModal(true);
    };

    const handleDelete = (problem) => {
        setSelectedProblem(problem);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        deleteMutation.mutate(selectedProblem.id);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Problem Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingProblem(null);
                        setShowModal(true);
                    }}
                >
                    <PlusIcon className="size-5" />
                    Add New Problem
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
                                <th>ID</th>
                                <th>Title</th>
                                <th>Difficulty</th>
                                <th>Category</th>
                                <th>Test Cases</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.problems?.map((problem) => (
                                <tr key={problem.id}>
                                    <td className="font-mono text-sm">{problem.id}</td>
                                    <td className="font-semibold">{problem.title}</td>
                                    <td>
                                        <span className={`badge ${problem.difficulty === 'Easy' ? 'badge-success' :
                                            problem.difficulty === 'Medium' ? 'badge-warning' :
                                                'badge-error'
                                            }`}>
                                            {problem.difficulty}
                                        </span>
                                    </td>
                                    <td className="text-sm">{problem.category}</td>
                                    <td>{problem.testCases?.length || 0}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-info btn-xs"
                                                onClick={() => handleEdit(problem)}
                                            >
                                                <EditIcon className="size-3" />
                                            </button>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleDelete(problem)}
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
                    <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-lg mb-4">
                            {editingProblem ? "Edit Problem" : "Create New Problem"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Problem ID (slug) *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="id"
                                        className="input input-bordered input-sm"
                                        placeholder="e.g., two-sum"
                                        defaultValue={editingProblem?.id}
                                        required
                                        disabled={!!editingProblem}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">Lowercase with hyphens</span>
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Title *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="input input-bordered input-sm"
                                        placeholder="e.g., Two Sum"
                                        defaultValue={editingProblem?.title}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Difficulty *</span>
                                    </label>
                                    <select
                                        name="difficulty"
                                        className="select select-bordered select-sm"
                                        defaultValue={editingProblem?.difficulty || "Easy"}
                                        required
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        className="input input-bordered input-sm"
                                        placeholder="e.g., Array • Hash Table"
                                        defaultValue={editingProblem?.category}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Function Name *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="functionName"
                                        className="input input-bordered input-sm"
                                        placeholder="e.g., twoSum"
                                        defaultValue={editingProblem?.functionName}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Description *</span>
                                </label>
                                <textarea
                                    name="descriptionText"
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Main problem description..."
                                    defaultValue={editingProblem?.description?.text}
                                    required
                                />
                            </div>

                            {/* Examples */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Examples (JSON Array)</span>
                                </label>
                                <textarea
                                    name="examples"
                                    className="textarea textarea-bordered font-mono text-xs h-32"
                                    placeholder='[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "..."}]'
                                    defaultValue={editingProblem ? JSON.stringify(editingProblem.examples, null, 2) : "[]"}
                                />
                            </div>

                            {/* Test Cases */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Test Cases (JSON Array) *</span>
                                </label>
                                <textarea
                                    name="testCases"
                                    className="textarea textarea-bordered font-mono text-xs h-40"
                                    placeholder='[{"params": [[2,7,11,15], 9], "expected": [0,1]}]'
                                    defaultValue={editingProblem ? JSON.stringify(editingProblem.testCases, null, 2) : ""}
                                    required
                                />
                            </div>

                            {/* Constraints, Notes, Hints, Tags */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Constraints (JSON Array)</span>
                                    </label>
                                    <textarea
                                        name="constraints"
                                        className="textarea textarea-bordered font-mono text-xs h-24"
                                        placeholder='["2 <= nums.length <= 10^4"]'
                                        defaultValue={editingProblem ? JSON.stringify(editingProblem.constraints, null, 2) : "[]"}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Notes (JSON Array)</span>
                                    </label>
                                    <textarea
                                        name="notes"
                                        className="textarea textarea-bordered font-mono text-xs h-24"
                                        placeholder='["You may not use the same element twice"]'
                                        defaultValue={editingProblem ? JSON.stringify(editingProblem.description?.notes, null, 2) : "[]"}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Hints (JSON Array)</span>
                                    </label>
                                    <textarea
                                        name="hints"
                                        className="textarea textarea-bordered font-mono text-xs h-24"
                                        placeholder='["Try using a hash map"]'
                                        defaultValue={editingProblem ? JSON.stringify(editingProblem.hints, null, 2) : "[]"}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Tags (JSON Array)</span>
                                    </label>
                                    <textarea
                                        name="tags"
                                        className="textarea textarea-bordered font-mono text-xs h-24"
                                        placeholder='["array", "hash-table"]'
                                        defaultValue={editingProblem ? JSON.stringify(editingProblem.tags, null, 2) : "[]"}
                                    />
                                </div>
                            </div>

                            {/* Time and Memory Limits */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Time Limit (ms)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="timeLimit"
                                        className="input input-bordered input-sm"
                                        defaultValue={editingProblem?.timeLimit || 2000}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Memory Limit (MB)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="memoryLimit"
                                        className="input input-bordered input-sm"
                                        defaultValue={editingProblem?.memoryLimit || 128}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="alert alert-info">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-sm">
                                    All problems are stored in MongoDB and persist across server restarts.
                                </span>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingProblem(null);
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
                                        : editingProblem
                                            ? "Update"
                                            : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Problem Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedProblem(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Problem"
                message={`Are you sure you want to delete "${selectedProblem?.title}"? This cannot be undone.`}
                confirmText="Delete Problem"
                variant="error"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}

export default ProblemManagement;
