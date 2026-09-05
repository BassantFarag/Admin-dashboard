/*
 * Users Table Skeleton
 *
 * File Purpose:
 * Renders an animated placeholder skeleton loader for the Users Table using `react-loading-skeleton`.
 *
 * Responsibilities:
 * - Responsible for the Loading UI of the Users Table while user data is being fetched or mutated.
 * - Uses `react-loading-skeleton` library to produce animated shimmer placeholders instead of manual CSS animations.
 * - Replicates the exact visual layout, columns, dimensions, and rows of the actual UsersTable.
 *
 * Data & Logic:
 * - Contains NO users data or business logic.
 * - Purely a presentational loading placeholder component.
 *
 * Rendering Control:
 * - Its visibility is controlled exclusively by `UsersTable` (and parent `Users.jsx`) via the `isLoading` prop.
 */

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const UsersTableSkeleton = () => {
  // Generate 6 placeholder skeleton rows to match the default table density.
    const skeletonRows = Array.from({ length: 6 })

    return (
        <div className="overflow-hidden rounded-2xl border border-border-custom bg-card shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
            {/* Table Header Skeleton */}
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

            {/* Table Body Skeleton Rows with Shimmer Animation (without row dividers) */}
            <tbody>
                {skeletonRows.map((_, index) => (
                <tr key={index} className="transition-colors">
                    {/* 1. User Column: Circular Avatar + Username & Email Lines */}
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        {/* User Avatar Skeleton */}
                        <Skeleton circle width={44} height={44} className="shrink-0" />

                        {/* Username and Email Skeletons */}
                        <div className="flex flex-col gap-1.5 min-w-0">
                        <Skeleton width={120} height={16} borderRadius={6} />
                        <Skeleton width={160} height={12} borderRadius={4} />
                        </div>
                    </div>
                    </td>

                    {/* 2. Role Badge Skeleton */}
                    <td className="px-6 py-4">
                    <Skeleton width={75} height={24} borderRadius={9999} />
                    </td>

                    {/* 3. Verification Status Skeleton */}
                    <td className="px-6 py-4">
                    <Skeleton width={90} height={24} borderRadius={9999} />
                    </td>

                    {/* 4. Action Buttons Skeleton: Edit, Role Change, Delete */}
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Skeleton width={36} height={36} borderRadius={8} />
                        <Skeleton width={36} height={36} borderRadius={8} />
                        <Skeleton width={36} height={36} borderRadius={8} />
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        // </div>
    )
}

export default UsersTableSkeleton