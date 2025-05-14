

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ViewMovieDetail from "./pages/User/ViewMovieDetail";
import ManageTask from "./pages/Admin/ManageTask";
import { toast, ToastContainer } from 'react-toastify';
import AdminDashboard from "./pages/Admin/AdminDashboard";
import GetMovies from "./components/moviesLayout/GetMovies";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";
import SubscriptionPage from './pages/User/SubscriptionPage'
// import CheckoutForm from './pages/User/CheckoutForm'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Success from "../src/pages/User/Success"
import UserInfo from "./pages/User/UserInfo";


function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
    });
  }, []); 

  return (
    <div>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/success" element={<Success />} />
          {/* User */}
          <Route path="/user/viewMovieDetail/:id" element={<ViewMovieDetail />} />
          <Route path="/user/getMovies" element={<GetMovies />} />
          <Route path='/user/subscription' element={<SubscriptionPage />} />
          <Route path="/user/info" element={<UserInfo />} />


          {/* Admin */}
          <Route path="/admin/manageTask" element={<ManageTask />} />
          <Route path="/admin/manageTask/:id" element={<ManageTask />} />
          <Route path="/user/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;