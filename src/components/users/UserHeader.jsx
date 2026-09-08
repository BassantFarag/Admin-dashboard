/*
 * User Header
 *
 * File Purpose:
 * Renders the top header of the Users management section including the search bar and the collapsible Add User form.
 *
 * Responsibilities:
 * - Controls the local search input UI and passes value updates to the parent via `onSearchChange`.
 * - Manages local collapsible state (`isOpen`) for the Add User form panel.
 * - Manages local form state (`formData`) for creating a new user.
 * - Forwards form data to the parent via `onAddUser` and resets the form upon successful creation.
 *
 * Data Source:
 * - Controlled local state for search input and user creation form fields.
 *
 * Relationship to Other Components:
 * - Child component of `Users.jsx`.
 * - Calls parent callbacks `onAddUser` and `onSearchChange`.
 * - Uses shared UI components `Input` and `Button`.
 *
 * What It Must NOT Manage:
 * - Does not hold or modify the shared users list or reducer.
 * - Does not make direct API calls (delegates to parent callback `onAddUser`).
 */

import { useState } from 'react'
import { ChevronDown, Search, UserPlus, X } from 'lucide-react'
import Button from '../ui/button'
import Input from '../ui/input'

const UserHeader = ({ onAddUser, onSearchChange }) => {
  // Local state to toggle the visibility of the Add User form panel.
  const [isOpen, setIsOpen] = useState(false)

  // Local state to manage the new user form input values.
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  })
  
  // Forward search input text changes to the parent component for filtering.
  const onSearchInputChange = (e) => {
    const value = e.target.value
    onSearchChange(value) 
  }

  // Handle new user form submission, delegate API execution to parent, and reset form on success.
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Invoke the parent callback to perform the user creation API request.
    const success = await onAddUser(formData)

    // On successful creation, reset the local form inputs and collapse the panel.
    if (success) {
      setFormData({
        username: '',
        email: '',
        password: '',
        phone: '',
      })

      setIsOpen(false)
    }
  }
    
  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex flex-col gap-5 rounded-xl bg-card p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-active">User Management</p>
          <h2 className="text-2xl font-semibold text-primary">Manage Users</h2>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="grow">
            <Input placeholder="Search users..." leftIcon={<Search className="h-5 w-5" />} onChange={onSearchInputChange} />
          </div>

          <Button className='bg-active text-primary hover:bg-active-hover' onClick={() => setIsOpen(!isOpen)} leftIcon={<UserPlus className="h-5 w-5" />} rightIcon={<ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}>
            Add User
          </Button>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="overflow-hidden rounded-2xl border border-border-custom bg-card shadow-xl">
            <div className="flex items-start justify-between gap-4 bg-active-bg px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-active text-white">
                  <UserPlus className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-primary">Create New User</h3>
                  <p className="text-sm text-secondary">Fill in the details below to add a new user</p>
                </div>
              </div>

              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-secondary transition-colors hover:bg-input hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="flex flex-col gap-6 p-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Input 
                  label="Username" 
                  placeholder="e.g. john_doe" 
                  required
                  value={formData.username} 
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                />
                <Input 
                  label="Email" 
                  type="email" 
                  placeholder="e.g. john@email.com" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="Min. 6 characters" 
                  required 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                />
                <Input 
                  label="Phone" 
                  type="tel" 
                  placeholder="e.g. +1 234 567 890" 
                  required 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                />
              </div>

              <div className="flex flex-col gap-4 border-t border-border-custom pt-5 sm:flex-row sm:items-center sm:justify-end">
                <Button type="reset" className="w-full border border-border-custom bg-active-bg text-active shadow-none hover:bg-active hover:text-white sm:w-auto">
                  Clear
                </Button>

                <Button type="submit" className="w-full sm:w-auto bg-active text-primary hover:bg-active-hover" leftIcon={<UserPlus className="h-5 w-5" />}>
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserHeader