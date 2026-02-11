import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../data/navItems'

type Role = UserRole

interface LoginState {
  role: Role
  username: string
  password: string
}

const Login: React.FC = () => {
  const [state, setState] = useState<LoginState>({ role: 'manager', username: '', password: '' })
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((s) => ({ ...s, [name]: value } as LoginState))
  }

  const handleRole = (role: Role) => setState((s) => ({ ...s, role }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // API gateway isn't ready yet — simulate a login attempt
    console.log('Login attempt:', { role: state.role, username: state.username })
    if (state.username && state.password) {
      // demo login through context so the app updates immediately
      login(state.role, state.username)
      navigate('/')
    } else {
      alert('Enter username and password (demo).')
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="bg-gradient-to-b from-indigo-600 via-blue-600 to-violet-600 text-white p-12">
        <div className="max-w-sm">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-white/10 rounded-lg mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
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
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
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
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
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
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
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
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </div>
          </div>

          <h2 className="text-center text-xl font-semibold mb-1">Welcome Back</h2>
          <p className="text-center text-sm text-slate-500 mb-4">Sign in to access your warehouse portal</p>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleRole('manager')}
              className={`flex-1 p-2 rounded-md border ${state.role === 'manager' ? 'bg-white border-indigo-300' : 'bg-white/50 border-transparent'}`}>
              Manager Portal
            </button>
            <button
              type="button"
              onClick={() => handleRole('picker')}
              className={`flex-1 p-2 rounded-md border ${state.role === 'picker' ? 'bg-white border-indigo-300' : 'bg-white/50 border-transparent'}`}>
              Picker Access
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs block mb-1 text-slate-600">Username</label>
              <input
                name="username"
                value={state.username}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-md text-sm"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="text-xs block mb-1 text-slate-600">Password</label>
              <input
                name="password"
                type="password"
                value={state.password}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-md text-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2">
              Sign In to Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
