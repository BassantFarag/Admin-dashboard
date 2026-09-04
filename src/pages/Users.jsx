/*
 * Users Page
 *
 * File Purpose:
 * Main parent page component for user management in the admin dashboard.
 *
 * Single Source of Truth:
 * - Users.jsx is the parent component and the single source of truth for the shared users state.
 * - Centralizes users data using useReducer to ensure state synchronization across all child components.
 *
 * Full Page Loading Control:
 * - `isLoading` in Users.jsx is the sole controller for the loading UI of the entire Users page.
 * - When `isLoading === true`, the entire page content (UserHeader, StatCards, UsersTable) is replaced
 *   with the animated full-page skeleton (`UsersSkeleton`) using `react-loading-skeleton`.
 *
 * Search Behavior:
 * - Search is strictly client-side filtering on `state.users` producing `filteredUsers`.
 * - Search does NOT trigger any loading states, spinners, or API requests, allowing instantaneous results.
 *
 * Relationship to Other Components:
 * - `UserHeader`: Receives action callbacks (`onAddUser` and `onSearchChange`). Does not own shared users data.
 * - `StatCard`s: Directly derive count metrics from `state.users`.
 * - `UsersTable`: Receives `filteredUsers` array and action callbacks (`onSaveChanges`, `onChangeRole`, `onDeleteUser`).
 */

import { useEffect, useReducer, useState } from 'react'
import { Shield, UserCheck, Users2 } from 'lucide-react'
import { toast } from 'react-toastify'
import StatCard from '../components/ui/StatCard'
import UserHeader from '../components/users/UserHeader'
import UsersTable from '../components/users/UsersTable'
import UsersSkeleton from '../components/users/UsersSkeleton'
import { addAllUser, deleteUser, getAllUsers, updateUser } from '../api/usersApi'
import { changeRole } from '../api/authApi'

// Initial state containing the shared users list and the page-level loading flag.
const initialState = {
  users: [],
  isLoading: false,
}

// Reducer function managing centralized state transitions for users data and page loading.
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      // Replace the current users array with the fresh data from the API response.
      return {
        ...state,
        users: action.payload,
      }

    case 'SET_LOADING':
      // Set page-level loading state to display or dismiss the full-page skeleton.
      return {
        ...state,
        isLoading: action.payload,
      }

    case 'UPDATE_USER':
      // Update specific user in state by matching ID while keeping other users unchanged.
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      }

    case 'CHANGE_ROLE':
      // Update user role in state to immediately reflect changes in table and statistics.
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      }

    case 'DELETE_USER':
      // Remove deleted user from state by filtering out their user ID.
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
      }

    default:
      return state
  }
}

const Users = () => {
  // Local state for the search query to perform immediate client-side filtering without page loading.
  const [valueSearch, setValueSearch] = useState('')

  // Centralized useReducer hook for managing users data and page-level loading.
  const [state, dispatch] = useReducer(reducer, initialState)

  // Client-side computed array filtering users by username or email without modifying state.users.
  const filteredUsers = state.users.filter((user) =>
    (user.username || '').toLowerCase().includes(valueSearch.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(valueSearch.toLowerCase())
  )

  // Fetch initial users list from the backend API on page load with full-page loading indicator.
  const fetchUsers = async () => {
    // Start full-page loading before sending the initial fetch request.
    dispatch({
      type: 'SET_LOADING',
      payload: true,
    })

    try {
      // Send GET request to retrieve all registered users from the backend API.
      const response = await getAllUsers()

      // Synchronize the shared users state with the retrieved data array.
      dispatch({
        type: 'SET_USERS',
        payload: response.data.users,
      })
    } catch (error) {
      // Display error toast notification if the API request fails.
      const message = error.response?.data?.message || 'Failed to fetch users'
      toast.error(message)
    } finally {
      // Stop full-page loading after request completion (whether successful or failed).
      dispatch({
        type: 'SET_LOADING',
        payload: false,
      })
    }
  }

  // Trigger initial data fetching when the Users component mounts.
  useEffect(() => {
    fetchUsers()
  }, [])

  // Create a new user via API and refresh the users list, maintaining page loading throughout.
  const handleAddUser = async (formData) => {
    // Start continuous full-page loading covering both user creation and list re-fetching.
    dispatch({
      type: 'SET_LOADING',
      payload: true,
    })

    try {
      // Send POST request with new user payload to the creation API.
      const response = await addAllUser(formData)

      // Display server success notification to the user.
      toast.success(response.data.message)

      // Fetch the updated users list from the API to update the shared state.
      const usersResponse = await getAllUsers()
      dispatch({
        type: 'SET_USERS',
        payload: usersResponse.data.users,
      })

      return true
    } catch (error) {
      // Display error notification if user creation fails.
      const message =
        error.response?.data?.message || 'Failed to create user'
      toast.error(message)

      return false
    } finally {
      // Stop full-page loading only after both creation and list synchronization finish.
      dispatch({
        type: 'SET_LOADING',
        payload: false,
      })
    }
  }

  // Update existing user profile information via API and synchronize the shared state.
  const handleSaveChanges = async (
    selectedUser,
    editFormData,
    setSelectedUser
  ) => {
    // Start full-page loading before sending the update request.
    dispatch({
      type: 'SET_LOADING',
      payload: true,
    })

    try {
      // Send PATCH request with updated profile fields to the backend API.
      const response = await updateUser(selectedUser._id, editFormData)

      // Update the modified user in the shared users state.
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.user,
      })

      // Display update success notification.
      toast.success(response.data.message)

      // Close the native HTML dialog modal.
      document.getElementById('edit-user-dialog')?.close()

      // Reset the selected user state inside UsersTable.
      if (setSelectedUser) {
        setSelectedUser(null)
      }
    } catch (error) {
      // Display error toast if update request fails.
      const message =
        error.response?.data?.message || 'Failed to update user'
      toast.error(message)
    } finally {
      // Stop full-page loading after the update finishes.
      dispatch({
        type: 'SET_LOADING',
        payload: false,
      })
    }
  }

  // Toggle user role between admin and customer via API and update state.
  const handleChangeRole = async (user) => {
    // Start full-page loading before sending the role change request.
    dispatch({
      type: 'SET_LOADING',
      payload: true,
    })

    try {
      // Determine the next toggled role.
      const newRole = user.role === 'admin' ? 'customer' : 'admin'

      // Send PATCH request to update the user's role on the backend.
      const response = await changeRole({
        userId: user._id,
        role: newRole,
      })

      // Update the user's role in the shared reducer state.
      dispatch({
        type: 'CHANGE_ROLE',
        payload: response.data.user,
      })

      // Display success notification.
      toast.success(response.data.message)
    } catch (error) {
      // Display error notification if role change fails.
      const message =
        error.response?.data?.message || 'Failed to change user role'
      toast.error(message)
    } finally {
      // Stop full-page loading after the request completes.
      dispatch({
        type: 'SET_LOADING',
        payload: false,
      })
    }
  }

  // Delete user by ID via API and remove them from the shared users state.
  const handleDeleteUser = async (user) => {
    // Start full-page loading before sending the delete request.
    dispatch({
      type: 'SET_LOADING',
      payload: true,
    })

    try {
      // Send DELETE request targeting the user's ID.
      const response = await deleteUser(user._id)

      // Remove the deleted user ID from the shared users list.
      dispatch({
        type: 'DELETE_USER',
        payload: user._id,
      })

      // Display deletion success notification.
      toast.success(response.data.message)
    } catch (error) {
      // Display error notification if deletion fails.
      const message =
        error.response?.data?.message || 'Failed to delete user'
      toast.error(message)
    } finally {
      // Stop full-page loading after deletion completes.
      dispatch({
        type: 'SET_LOADING',
        payload: false,
      })
    }
  }

  // When full-page loading is active, render the complete page skeleton.
  if (state.isLoading) {
    return <UsersSkeleton />
  }

  return (
    <section className="space-y-6">
      {/* Header section containing search bar and add user form */}
      <UserHeader 
        onAddUser={handleAddUser} 
        onSearchChange={setValueSearch}
      />

      {/* Summary statistics cards automatically computed from state.users */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={state.users.length}
          icon={<Users2 className="h-6 w-6" />}
        />

        <StatCard
          title="Admins"
          value={state.users.filter((u) => u.role === 'admin').length}
          icon={<Shield className="h-6 w-6" />}
        />

        <StatCard
          title="Customers"
          value={state.users.filter((u) => u.role === 'customer').length}
          icon={<Users2 className="h-6 w-6" />}
        />

        <StatCard
          title="Verified"
          value={state.users.filter((u) => u.isVerified).length}
          icon={<UserCheck className="h-6 w-6" />}
        />
      </div>

      {/* Users table component displaying filtered users list */}
      <UsersTable
        users={filteredUsers}
        onSaveChanges={handleSaveChanges}
        onChangeRole={handleChangeRole}
        onDeleteUser={handleDeleteUser}
      />
    </section>
  )
}

export default Users