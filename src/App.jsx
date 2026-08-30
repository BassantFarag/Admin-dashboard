import React from 'react'
import DashboardLayout from './layouts/DashboardLayout'
import { RouterProvider } from 'react-router-dom';
import {router} from './routes/Router'

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App