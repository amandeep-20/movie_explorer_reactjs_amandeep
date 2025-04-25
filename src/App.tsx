import React from 'react'
import {BrowserRouter as Router,Routes,Route,} from "react-router-dom"
import './App.css'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'

import UserDashboard from './pages/User/UserDashboard'
import ViewMovieDetail from './pages/User/ViewMovieDetail'

import ManageTask from './pages/Admin/ManageTask'
function App() {

  return (
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            {/* User */}
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/viewMovieDetail" element={<ViewMovieDetail />} />

            {/* Admin */}
            <Route path="/admin/manageTask" element={<ManageTask />} />
          </Routes>
        </Router>
      </div>
  )
}

export default App
