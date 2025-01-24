"use client"

import { useState } from "react"
import { supabase } from "../utils/supabase"
import Link from "next/link"

export default function VetRegister() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [clinicName, setClinicName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Add the vet details to the veterinarian table
        const { error: vetError } = await supabase.from("veterinarian").insert({
          vetid: authData.user.id,
          name,
          clinicname: clinicName,
          contactnumber: contactNumber,
          email,
        })

        if (vetError) throw vetError

        setSuccess(true)
      }
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center">Register as a Veterinarian</h3>
        {success ? (
          <div className="mt-4 text-center">
            <p className="text-green-500 mb-4">Registration successful! Please log in.</p>
            <Link href="/vet-login" className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
              Go to Login Page
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mt-4">
              <div>
                <label className="block" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  id="name"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="clinicName">
                  Clinic Name
                </label>
                <input
                  type="text"
                  placeholder="Clinic Name"
                  id="clinicName"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="contactNumber">
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="Contact Number"
                  id="contactNumber"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-baseline justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </div>
          </form>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  )
}

