import { useContext } from 'react'
import DashboardLayout from './layouts/DashboardLayout'
import { RouterProvider } from 'react-router-dom';
import {router} from './routes/Router'
import AuthContext from './contexts/AuthContext';
import Loading from './pages/Loading';

const App = () => {
  const { isLoading } = useContext(AuthContext);
  if (isLoading) return <Loading />

  return (
    <RouterProvider router={router} />
  )
}

export default App