import React from 'react'
import {BrowserRouter as Router,Routes,Route,} from "react-router-dom"
import './App.css'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'

import UserDashboard from './pages/User/UserDashboard'
import ViewMovieDetail from './pages/User/ViewMovieDetail'

import ManageTask from './pages/Admin/ManageTask'
import { Toaster } from 'react-hot-toast'
import AdminDashboard from './pages/Admin/AdminDashboard'
function App() {

  return (
      <div>
        <Router>
          <Toaster/>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            {/* User */}
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/viewMovieDetail/:id" element={<ViewMovieDetail />} />

            {/* Admin */}
            <Route path="/admin/manageTask" element={<ManageTask />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </div>
  )
}

export default App
