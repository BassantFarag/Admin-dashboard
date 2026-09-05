/*
 * Users Page Skeleton
 *
 * File Purpose:
 * Renders a full-page animated skeleton loader for the entire Users page while
 * asynchronous operations are pending.
 *
 * Responsibilities:
 * - Provides visual shimmer placeholder for the complete Users page UI (Header, Stat Cards, and Table).
 * - Prevents layout shift by closely mirroring the dimensions and grid structure of the live page.
 * - Utilizes `react-loading-skeleton` for smooth animated shimmer effects across the whole page.
 *
 * Data & Logic:
 * - Contains NO users data or business logic.
 * - Purely a presentational loading placeholder component.
 *
 * Relationship to Other Components:
 * - Rendered by `Users.jsx` when `state.isLoading === true`.
 * - Composes `UsersTableSkeleton` for the table area.
 */

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import UsersTableSkeleton from './UsersTableSkeleton'

const UsersSkeleton = () => {
  return (
    <section className="space-y-6">
      {/* 1. Header Area Skeleton (matches UserHeader layout) */}
      <div className="flex flex-col gap-3">
        <div className="relative flex flex-col gap-5 rounded-xl border border-border-custom bg-card p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          {/* Title and subtitle placeholders */}
          <div className="flex flex-col gap-2">
            <Skeleton width={120} height={16} borderRadius={4} />
            <Skeleton width={160} height={28} borderRadius={6} />
          </div>

          {/* Search input and Add User button placeholders */}
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="w-full sm:w-64">
              <Skeleton height={42} borderRadius={10} />
            </div>
            <div className="w-full sm:w-32">
              <Skeleton height={42} borderRadius={10} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Skeleton Grid (matches 4 StatCard components) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl border border-border-custom bg-card p-5 shadow-sm"
          >
            {/* Stat Title and Value placeholders */}
            <div className="flex flex-col gap-2">
              <Skeleton width={70} height={14} borderRadius={4} />
              <Skeleton width={45} height={28} borderRadius={6} />
            </div>

            {/* Stat Icon container placeholder */}
            <Skeleton width={48} height={48} borderRadius={12} />
          </div>
        ))}
      </div>

      {/* 3. Table Skeleton (matches UsersTable layout) */}
      <UsersTableSkeleton />
    </section>
  )
}

export default UsersSkeleton
