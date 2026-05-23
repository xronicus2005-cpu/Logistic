import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "./App.css"

import SigiUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import SellerPage from "./pages/SellerPage"
import CustomerPage from "./pages/Customer"
import DriverPage from "./pages/DriverPage"
import CustomerOrders from "./pages/CustomerOrders"

import ProtectedRoute from "./hooks/ProtectedRoute"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SigiUp />} />
        <Route path="/sign-in" element={<SignIn />} />

        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRole="Sotuvchi">
              <SellerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRole="Xaridor">
              <CustomerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRole="Xaridor">
              <CustomerOrders/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRole="Kurer">
              <DriverPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer />
    </>
  )
}

export default App