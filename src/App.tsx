import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ViewMovieDetail from "./pages/User/ViewMovieDetail";
import ManageTask from "./pages/Admin/ManageTask";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import GetMovies from "./components/moviesLayout/GetMovies";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";
import SubscriptionPage from './pages/User/SubscriptionPage'
// import CheckoutForm from './pages/User/CheckoutForm'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Success from "./pages/User/Success"

const stripePromise = loadStripe('pk_test_51RJqGsI2rCWiq8PAs2nNUz5gv4DO8mVfG1QCuu3F3Xqft2a55FIGY15bNnlz6SoqlU4i1w5HRm1XDmOuEnZk7tI200tg2o30i1')

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
        <Toaster />
        <Routes>
        <Route
          path="/checkout"
          element={
            <Elements stripe={stripePromise}>
              {/* <CheckoutForm /> */}
            </Elements>
          }
        />
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/success" element={<Success />} />
          {/* User */}
          <Route path="/user/viewMovieDetail/:id" element={<ViewMovieDetail />} />
          <Route path="/user/getMovies" element={<GetMovies />} />
          <Route path='/user/subscription' element={<SubscriptionPage />} />


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