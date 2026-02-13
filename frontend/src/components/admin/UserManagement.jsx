import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, banUser, unbanUser, deleteUser } from "../../api/admin";
import { SearchIcon, BanIcon, CheckCircleIcon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../ConfirmModal";

function UserManagement() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showBanModal, setShowBanModal] = useState(false);
    const [showUnbanModal, setShowUnbanModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [banReason, setBanReason] = useState("");
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["adminUsers", page, search],
        queryFn: () => getAllUsers(page, 20, search),
    });

    const banMutation = useMutation({
        mutationFn: ({ userId, reason }) => banUser(userId, reason),
        onSuccess: () => {
            toast.success("User banned successfully");
            queryClient.invalidateQueries(["adminUsers"]);
            setShowBanModal(false);
            setSelectedUser(null);
            setBanReason("");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to ban user");
        },
    });

    const unbanMutation = useMutation({
        mutationFn: unbanUser,
        onSuccess: () => {
            toast.success("User unbanned successfully");
            queryClient.invalidateQueries(["adminUsers"]);
            setShowUnbanModal(false);
            setSelectedUser(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to unban user");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success("User deleted successfully");
            queryClient.invalidateQueries(["adminUsers"]);
            setShowDeleteModal(false);
            setSelectedUser(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete user");
        },
    });

    const handleBanClick = (user) => {
        setSelectedUser(user);
        setShowBanModal(true);
    };

    const handleBanSubmit = () => {
        if (!banReason.trim()) {
            toast.error("Please provide a ban reason");
            return;
        }
        banMutation.mutate({ userId: selectedUser._id, reason: banReason });
    };

    const handleUnbanClick = (user) => {
        setSelectedUser(user);
        setShowUnbanModal(true);
    };

    const handleUnbanConfirm = () => {
        unbanMutation.mutate(selectedUser._id);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        deleteMutation.mutate(selectedUser._id);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">User Management</h2>
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input input-bordered pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Coins</th>
                                    <th>Streak</th>
                                    <th>Solved</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.users?.map((user) => (
                                    <tr key={user._id}>
                                        <td className="font-semibold">{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.isAdmin ? 'badge-primary' : 'badge-ghost'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.coins}</td>
                                        <td>{user.streak}</td>
                                        <td>{user.solvedProblems?.length || 0}</td>
                                        <td>
                                            {user.banned ? (
                                                <div className="tooltip" data-tip={user.bannedReason}>
                                                    <span className="badge badge-error">Banned</span>
                                                </div>
                                            ) : (
                                                <span className="badge badge-success">Active</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                {!user.isAdmin && (
                                                    <>
                                                        {user.banned ? (
                                                            <button
                                                                className="btn btn-success btn-xs"
                                                                onClick={() => handleUnbanClick(user)}
                                                                disabled={unbanMutation.isLoading}
                                                                title="Unban user"
                                                            >
                                                                <CheckCircleIcon className="size-3" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-warning btn-xs"
                                                                onClick={() => handleBanClick(user)}
                                                                disabled={banMutation.isLoading}
                                                                title="Ban user"
                                                            >
                                                                <BanIcon className="size-3" />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn btn-error btn-xs"
                                                            onClick={() => handleDelete(user)}
                                                            disabled={deleteMutation.isPending}
                                                            title="Delete user"
                                                        >
                                                            <TrashIcon className="size-3" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <button
                            className="btn btn-sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>
                        <span className="text-sm">
                            Page {page} of {data?.pagination?.pages || 1}
                        </span>
                        <button
                            className="btn btn-sm"
                            disabled={page >= (data?.pagination?.pages || 1)}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {/* Ban Modal */}
            {showBanModal && selectedUser && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Ban User</h3>
                        <p className="mb-4">
                            You are about to ban <span className="font-bold">{selectedUser.name}</span> ({selectedUser.email})
                        </p>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Ban Reason *</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                placeholder="Enter the reason for banning this user..."
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                required
                            />
                        </div>

                        <div className="alert alert-warning mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>The user will be immediately logged out and unable to access the platform.</span>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => {
                                    setShowBanModal(false);
                                    setSelectedUser(null);
                                    setBanReason("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={handleBanSubmit}
                                disabled={banMutation.isLoading || !banReason.trim()}
                            >
                                {banMutation.isLoading ? "Banning..." : "Ban User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Unban Modal */}
            {showUnbanModal && selectedUser && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Unban User</h3>
                        <p className="mb-4">
                            Are you sure you want to unban <span className="font-bold">{selectedUser.name}</span> ({selectedUser.email})?
                        </p>

                        <div className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <p className="text-sm">Original ban reason:</p>
                                <p className="text-sm font-semibold">{selectedUser.bannedReason}</p>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => {
                                    setShowUnbanModal(false);
                                    setSelectedUser(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={handleUnbanConfirm}
                                disabled={unbanMutation.isLoading}
                            >
                                {unbanMutation.isLoading ? "Unbanning..." : "Unban User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
                confirmText="Delete User"
                variant="error"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}

export default UserManagement;
