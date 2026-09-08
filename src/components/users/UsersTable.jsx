/*
 * Users Table
 *
 * File Purpose:
 * Renders the users list table and the user editing dialog modal.
 *
 * Responsibilities:
 * - Displays user information, role, verification status, and action buttons.
 * - Encapsulates local state for editing user profiles (selectedUser, editFormData).
 * - Forwards user actions (update, change role, delete) to parent callbacks.
 *
 * Data Source:
 * - Receives `users` array (filtered list) as props from Users.jsx.
 *
 * Relationship to Other Components:
 * - Child component of `Users.jsx`.
 * - Uses shared UI components `Input` and `Button`.
 *
 * What It Must NOT Manage:
 * - Does not hold or mutate the shared users state directly.
 * - Does not perform direct API requests (defers to parent callbacks).
 * - Page loading is handled at the page level in `Users.jsx`.
 */

import { useState } from "react";
import { Pencil, ShieldCheck, Trash2, X } from "lucide-react";
import Input from "../ui/input";
import Button from "../ui/button";

const UsersTable = ({ 
    users = [], 
    onSaveChanges, 
    onChangeRole, 
    onDeleteUser
}) => {
    // Local state for the user currently selected for editing.
    const [selectedUser, setSelectedUser] = useState(null);

    // Local state for the edit user form fields.
    const [editFormData, setEditFormData] = useState({
        username: "",
        phone: "",
        avatar: "",
    });

    // Open the edit modal and populate the form fields with the selected user's data.
    const handleEditUser = (user) => {
        setSelectedUser(user);

        setEditFormData({
            username: user.username || "",
            phone: user.phone || "",
            avatar: user.avatar || "",
        });
    };

    // Forward the edited user data to the parent component's save handler.
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        // Call the parent callback to execute the API request and update shared state.
        await onSaveChanges(selectedUser, editFormData, setSelectedUser);
    };

    // Forward the role change request to the parent component's handler.
    const handleChangeRole = (user) => {
        onChangeRole(user);
    };

    // Forward the delete request to the parent component's handler.
    const handleDeleteUser = (user) => {
        onDeleteUser(user);
    };

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-border-custom bg-card shadow-sm">
                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                    <table className="w-full min-w-[700px]">

                    {/* Table Header */}
                    <thead className="sticky top-0 z-10 border-b border-border-custom bg-input">
                        <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                            User
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                            Role
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                            Verified
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                            Actions
                        </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-border-custom">
                        {users.map((user) => (
                        <tr
                            key={user._id}
                            className="transition-colors hover:bg-active-bg"
                        >

                            {/* User Information */}
                            <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-input text-secondary">
                                <span className="text-lg font-semibold">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                                </div>

                                <div className="min-w-0">
                                <p className="truncate font-semibold text-primary">
                                    {user.username}
                                </p>

                                <p className="truncate text-sm text-secondary">
                                    {user.email}
                                </p>
                                </div>
                            </div>
                            </td>

                            {/* User Role */}
                            <td className="px-6 py-4">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                user.role === "admin"
                                    ? "bg-active-bg text-active"
                                    : "bg-input text-secondary"
                                }`}
                            >
                                {user.role}
                            </span>
                            </td>

                            {/* Verification Status */}
                            <td className="px-6 py-4">
                            {user.isVerified ? (
                                <div className="flex items-center gap-2 text-success">
                                <span className="text-sm font-medium">✅ Verified</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-danger">
                                <span className="text-sm font-medium">❌ Not Verified</span>
                                </div>
                            )}
                            </td>

                            {/* User Actions */}
                            <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEditUser(user)}
                                    aria-label={`Edit ${user.username}`}
                                    command="show-modal"
                                    commandfor="edit-user-dialog"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-info text-white transition hover:opacity-90"
                                >
                                <Pencil className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    aria-label={`Verify ${user.username}`}
                                    onClick={() => handleChangeRole(user)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-success text-white transition hover:opacity-90"
                                >
                                <ShieldCheck className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    aria-label={`Delete ${user.username}`}
                                    onClick={() => handleDeleteUser(user)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger text-white transition hover:opacity-90"
                                >
                                <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            </td>

                        </tr>
                        ))}
                    </tbody>

                    </table>
                </div>
            </div>
            {/* Edit User Modal */}
            <dialog id="edit-user-dialog" className="m-auto w-full max-w-lg rounded-3xl bg-card p-0 text-primary shadow-2xl backdrop:bg-primary/50">
            <div className="flex items-center justify-between border-b border-border-custom px-6 py-5">
                <h2 className="text-xl font-bold">
                Edit User
                </h2>

                <button
                    type="button"
                    command="request-close"
                    commandfor="edit-user-dialog"
                    aria-label="Close edit user modal"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-secondary transition hover:bg-input hover:text-primary"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form   className="flex flex-col gap-6 p-6" onSubmit={handleSaveChanges}>
                <Input
                    label="Username"
                    placeholder="Enter username"
                    required
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                />

                <Input
                    label="Phone"
                    type="tel"
                    placeholder="Enter phone number"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />

                <Input
                    label="Avatar URL"
                    type="url"
                    placeholder="https://example.com/avatar.png"
                    value={editFormData.avatar}
                    onChange={(e) => setEditFormData({ ...editFormData, avatar: e.target.value })}
                />

                <Button
                    type="submit"
                    className="w-full bg-active text-primary hover:bg-active-hover"
                >
                    Save Changes
                </Button>
            </form>
            </dialog>
        </>
    );
};

export default UsersTable;