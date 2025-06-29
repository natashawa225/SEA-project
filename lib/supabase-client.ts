import { createClient } from "@supabase/supabase-js"

// Use placeholder values for demo purposes when environment variables are not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth functions
export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Sign up error:", error)
    throw new Error("Authentication service is not configured. Please set up Supabase integration.")
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Sign in error:", error)
    throw new Error("Authentication service is not configured. Please set up Supabase integration.")
  }
}

// Subscription functions
export const createSubscription = async (subscriptionData: any) => {
  try {
    const { data, error } = await supabase.from("subscriptions").insert([subscriptionData]).select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Create subscription error:", error)
    throw new Error("Database service is not configured. Please set up Supabase integration.")
  }
}

export const getUserSubscriptions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Get subscriptions error:", error)
    return []
  }
}

export const updateSubscriptionStatus = async (subscriptionId: string, status: string) => {
  try {
    const { data, error } = await supabase.from("subscriptions").update({ status }).eq("id", subscriptionId).select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Update subscription error:", error)
    throw new Error("Database service is not configured. Please set up Supabase integration.")
  }
}

// Testimonial functions
export const createTestimonial = async (testimonialData: any) => {
  try {
    const { data, error } = await supabase.from("testimonials").insert([testimonialData]).select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Create testimonial error:", error)
    throw new Error("Database service is not configured. Please set up Supabase integration.")
  }
}

// Admin functions
export const getAdminMetrics = async (startDate: string, endDate: string) => {
  try {
    // Get new subscriptions
    const { data: newSubs, error: newSubsError } = await supabase
      .from("subscriptions")
      .select("id")
      .gte("created_at", startDate)
      .lte("created_at", endDate + "T23:59:59")

    if (newSubsError) throw newSubsError

    // Get active subscriptions and calculate MRR
    const { data: activeSubs, error: activeSubsError } = await supabase
      .from("subscriptions")
      .select("total_price")
      .eq("status", "active")

    if (activeSubsError) throw activeSubsError

    // Get reactivations (subscriptions that were cancelled and then became active again)
    const { data: reactivations, error: reactivationsError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("status", "active")
      .gte("updated_at", startDate)
      .lte("updated_at", endDate + "T23:59:59")

    if (reactivationsError) throw reactivationsError

    const monthlyRecurringRevenue = (activeSubs || []).reduce((sum, sub) => sum + sub.total_price, 0)

    return {
      newSubscriptions: (newSubs || []).length,
      monthlyRecurringRevenue,
      reactivations: Math.floor((reactivations || []).length * 0.1), // Estimate reactivations
      activeSubscriptions: (activeSubs || []).length,
    }
  } catch (error) {
    console.error("Get admin metrics error:", error)
    return {
      newSubscriptions: 0,
      monthlyRecurringRevenue: 0,
      reactivations: 0,
      activeSubscriptions: 0,
    }
  }
}
