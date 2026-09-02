import { Shield, UserCheck, Users2 } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import UserHeader from '../components/users/UserHeader'
import UsersTable from '../components/users/UsersTable'

const Users = () => {
  return (
    <section className='space-y-6'>
      <UserHeader />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="5"
          icon={<Users2 className="h-6 w-6" />}
        />

        <StatCard
          title="Admins"
          value="1"
          icon={<Shield className="h-6 w-6" />}
        />

        <StatCard
          title="Customers"
          value="4"
          icon={<Users2 className="h-6 w-6" />}
        />

        <StatCard
          title="Verified"
          value="2"
          icon={<UserCheck className="h-6 w-6" />}
        />
      </div>
      <UsersTable />
    </section>
  )
}

export default Users