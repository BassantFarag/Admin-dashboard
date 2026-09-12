// Search bar + collapsible "Add User" form for the Users page.
// Owns its own form state; delegates the actual API call to Users.jsx.

import { useState } from 'react'
import { ChevronDown, Search, UserPlus, Users2, X } from 'lucide-react'
import Button from '../ui/button'
import Input from '../ui/input'
import PageHeroHeader from '../ui/PageHeroHeader'

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
      <PageHeroHeader
        icon={<Users2 className="h-5 w-5" />}
        eyebrow="User Management"
        title="Manage Users"
        subtitle="Search your customers and admins, or add a new account."
        rightSlot={
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <div className="grow">
              <Input placeholder="Search users..." leftIcon={<Search className="h-5 w-5" />} onChange={onSearchInputChange} />
            </div>

            <Button className='header-btn-primary' onClick={() => setIsOpen(!isOpen)} leftIcon={<UserPlus className="h-5 w-5 header-btn-icon" />} rightIcon={<ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} header-btn-icon`} />}>
              <span className="header-btn-text">Add User</span>
            </Button>
          </div>
        }
      />

      <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="overflow-hidden rounded-2xl border border-border-custom bg-card shadow-xl">
            <div className="flex items-start justify-between gap-4 bg-active-bg px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-active text-bg-main">
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
                <Button type="reset" className="header-btn-clear w-full border border-border-custom shadow-none sm:w-auto">
                  <span className="header-btn-text">Clear</span>
                </Button>

                <Button type="submit" className="header-btn-primary w-full sm:w-auto" leftIcon={<UserPlus className="h-5 w-5 header-btn-icon" />}>
                  <span className="header-btn-text">Create User</span>
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