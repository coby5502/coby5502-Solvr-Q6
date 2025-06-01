import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import SleepRecordPage from './pages/sleep/SleepRecordPage'
import SleepAnalysisPage from './pages/sleep/SleepAnalysisPage'
import NotFoundPage from './pages/error/NotFoundPage'
import PrivateRoute from './components/common/PrivateRoute'
import ProfilePage from './pages/profile/ProfilePage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/records"
        element={
          <PrivateRoute>
            <MainLayout>
              <SleepRecordPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <PrivateRoute>
            <MainLayout>
              <SleepAnalysisPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes 