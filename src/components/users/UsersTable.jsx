import { Check, Pencil, ShieldCheck, Trash2, X } from "lucide-react";

const users = [
    {
        id: 1,
        username: "youseef",
        email: "you@koda.com",
        role: "customer",
        verified: false,
    },
    {
        id: 2,
        username: "moham9d",
        email: "moham9d.404@gmail.com",
        role: "customer",
        verified: true,
    },
    {
        id: 3,
        username: "Et sunt quod sed si",
        email: "gaboremyal@mailinator.com",
        role: "customer",
        verified: false,
    },
    {
        id: 4,
        username: "ahmed_lead",
        email: "ahmednagsharaf@gmail.com",
        role: "admin",
        verified: true,
    },
    {
        id: 5,
        username: "ahmed",
        email: "ahmed453196023@gmail.com",
        role: "customer",
        verified: false,
    },
    {
        id: 6,
        username: "ADMIN",
        email: "admin@koda.com",
        role: "admin",
        verified: false,
    },
    ];

    const UsersTable = () => {
    return (
        <div className="overflow-hidden rounded-2xl border border-border-custom bg-card shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
                <thead className="border-b border-border-custom bg-input">
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

                <tbody className="divide-y divide-border-custom">
                    {users.map((user) => (
                    <tr
                        key={user.id}
                        className="transition-colors hover:bg-active-bg"
                    >
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

                        <td className="px-6 py-4">
                        {user.verified ? (
                            <div className="flex items-center gap-2 text-success">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Verified</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-danger">
                            <X className="h-4 w-4" />
                            <span className="text-sm font-medium">No</span>
                            </div>
                        )}
                        </td>

                        <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <button
                            type="button"
                            aria-label={`Edit ${user.username}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-info text-white transition hover:opacity-90"
                            >
                            <Pencil className="h-4 w-4" />
                            </button>

                            <button
                            type="button"
                            aria-label={`Verify ${user.username}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-success text-white transition hover:opacity-90"
                            >
                            <ShieldCheck className="h-4 w-4" />
                            </button>

                            <button
                            type="button"
                            aria-label={`Delete ${user.username}`}
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
    );
};

export default UsersTable;
