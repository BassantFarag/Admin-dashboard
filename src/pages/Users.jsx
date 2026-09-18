import { useEffect, useReducer, useState } from 'react'
import { Shield, UserCheck, Users2 } from 'lucide-react'
import { toast } from 'react-toastify'
import StatCard from '../components/ui/StatCard'
import UserHeader from '../components/users/UserHeader'
import UsersTable from '../components/users/UsersTable'
import UsersSkeleton from '../components/users/UsersSkeleton'
import { addAllUser, deleteUser, getAllUsers, updateUser } from '../api/usersApi'
import { changeRole } from '../api/authApi'

const initialState = {
  users: [],
  isLoading: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      }

    case 'CHANGE_ROLE':
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      }

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
      }

    default:
      return state
  }
}

const Users = () => {
  const [valueSearch, setValueSearch] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)

  const filteredUsers = state.users.filter((user) =>
    (user.username || '').toLowerCase().includes(valueSearch.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(valueSearch.toLowerCase())
  )

  const fetchUsers = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const response = await getAllUsers()
      dispatch({ type: 'SET_USERS', payload: response.data.users })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users'
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAddUser = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const response = await addAllUser(formData)
      toast.success(response.data.message)

      const usersResponse = await getAllUsers()
      dispatch({ type: 'SET_USERS', payload: usersResponse.data.users })

      return true
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create user'
      toast.error(message)

      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleSaveChanges = async (
    selectedUser,
    editFormData,
    setSelectedUser
  ) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const response = await updateUser(selectedUser._id, editFormData)
      dispatch({ type: 'UPDATE_USER', payload: response.data.user })
      toast.success(response.data.message)

      document.getElementById('edit-user-dialog')?.close()

      if (setSelectedUser) {
        setSelectedUser(null)
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update user'
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleChangeRole = async (user) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const newRole = user.role === 'admin' ? 'customer' : 'admin'

      const response = await changeRole({
        userId: user._id,
        role: newRole,
      })

      dispatch({ type: 'CHANGE_ROLE', payload: response.data.user })
      toast.success(response.data.message)
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to change user role'
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleDeleteUser = async (user) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const response = await deleteUser(user._id)
      dispatch({ type: 'DELETE_USER', payload: user._id })
      toast.success(response.data.message)
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete user'
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  if (state.isLoading) {
    return <UsersSkeleton />
  }

  return (
    <section className="space-y-6">
      <UserHeader
        onAddUser={handleAddUser}
        onSearchChange={setValueSearch}
      />

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