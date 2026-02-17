import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../data/navItems'

type LoginRole = 'manager' | 'picker'

interface LoginState {
  role: LoginRole
  email: string
  password: string
  badgeNumber: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const PICKER_APP_URL = import.meta.env.VITE_PICKER_APP_URL || "http://localhost:3000";
const VALID_ROLES = ['admin', 'manager', 'picker'] as const;

const Login: React.FC = () => {
  const [state, setState] = useState<LoginState>({ 
    role: 'manager', 
    email: '', 
    password: '',
    badgeNumber: ''
  })
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((s) => ({ ...s, [name]: value }))
    setError('')
  }

  const handleRole = (role: LoginRole) => {
    setState((s) => ({ ...s, role }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (state.role === 'picker') {
        if (!state.badgeNumber.trim()) {
          setError('Please enter your badge number')
          setIsLoading(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}/v1/users/badge/${state.badgeNumber}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          if (response.status === 404) {
            setError('Badge number not found. Please check and try again.')
          } else {
            setError('Login failed. Please try again.')
          }
          setIsLoading(false)
          return
        }

        const userData = await response.json()

        // Validate badge API response structure
        if (!userData.role || !userData.name || !userData.id) {
          setError('Invalid response from server. Please contact support.')
          setIsLoading(false)
          return
        }

        if (userData.role !== 'picker') {
          setError('This badge is not registered as a picker. Use Manager/Admin login.')
          setIsLoading(false)
          return
        }

        window.location.href = `${PICKER_APP_URL}/login?badge=${state.badgeNumber}&auto=true`
        return
      }

      if (!state.email || !state.password) {
        setError('Please enter email and password')
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.email,
          password: state.password
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid email or password')
        } else {
          const errorData = await response.json().catch(() => ({}))
          setError(errorData.detail || 'Login failed. Please try again.')
        }
        setIsLoading(false)
        return
      }

      const userData = await response.json()
      
      // Validate login API response structure
      if (!userData.role || !userData.email || !userData.id || !userData.name) {
        setError('Invalid response from server. Please contact support.')
        setIsLoading(false)
        return
      }
      
      const userRole = userData.role.toLowerCase()
      
      // Validate that the role is one of the expected values
      if (!VALID_ROLES.includes(userRole as typeof VALID_ROLES[number])) {
        setError('Invalid user role. Please contact support.')
        setIsLoading(false)
        return
      }
      
      if (userRole === 'picker') {
        setError('Pickers must use the Badge Number login')
        setIsLoading(false)
        return
      }

      login(userRole as UserRole, userData.name, userData.id)
      navigate('/dashboard')

    } catch (err) {
      console.error('Login error:', err)
      setError('Unable to connect to server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="bg-gradient-to-b from-indigo-600 via-blue-600 to-violet-600 text-white p-12">
        <div className="max-w-sm">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-white/10 rounded-lg mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">WarehousePro</h1>
              <p className="text-sm opacity-90">Smart Pallet Stacking Platform</p>
            </div>
          </div>

          <ul className="space-y-6 text-sm">
            <li className="flex items-start">
              <div className="mr-3 p-2 bg-white/10 rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">3D Visual Guidance</div>
                <div className="text-xs opacity-90">Real-time 3D visualization guides workers</div>
              </div>
            </li>

            <li className="flex items-start">
              <div className="mr-3 p-2 bg-white/10 rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Inventory Management</div>
                <div className="text-xs opacity-90">Track stock levels and locations</div>
              </div>
            </li>

            <li className="flex items-start">
              <div className="mr-3 p-2 bg-white/10 rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Order Tracking</div>
                <div className="text-xs opacity-90">Monitor picking progress in real-time</div>
              </div>
            </li>
          </ul>

          <div className="text-xs opacity-80 mt-12">© 2024 WarehousePro. All rights reserved.</div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-[380px] bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-50 p-3 rounded-full">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <h2 className="text-center text-xl font-semibold mb-1">Welcome Back</h2>
          <p className="text-center text-sm text-slate-500 mb-4">Sign in to access your warehouse portal</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleRole('manager')}
              className={`flex-1 p-2 rounded-md border text-sm font-medium transition-colors ${
                state.role === 'manager' 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              Manager Portal
            </button>
            <button
              type="button"
              onClick={() => handleRole('picker')}
              className={`flex-1 p-2 rounded-md border text-sm font-medium transition-colors ${
                state.role === 'picker' 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              Picker Access
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {state.role === 'picker' ? (
              <div>
                <label className="text-xs block mb-1 text-slate-600 font-medium">Badge Number</label>
                <input
                  name="badgeNumber"
                  value={state.badgeNumber}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your badge number (e.g., P3003)"
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-400 mt-2">
                  You will be redirected to the Picker App
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs block mb-1 text-slate-600 font-medium">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={state.email}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="text-xs block mb-1 text-slate-600 font-medium">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={state.password}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-md mt-4 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading 
                ? 'Signing In...' 
                : state.role === 'picker' 
                  ? 'Go to Picker App' 
                  : 'Sign In to Portal'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
