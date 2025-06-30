"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        checkAdminStatus(session?.user ?? null)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Auth session error:", error)
        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      checkAdminStatus(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    try {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single()

      if (!error && data?.role === "admin") {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    } catch (error) {
      console.error("Check admin status error:", error)
      setIsAdmin(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isAdmin, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
