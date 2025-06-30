"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Calendar, DollarSign, Users, TrendingUp, Loader2, Shield } from "lucide-react"
import { getAdminMetrics } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

interface AdminMetrics {
  newSubscriptions: number
  monthlyRecurringRevenue: number
  reactivations: number
  activeSubscriptions: number
}

export default function AdminPage() {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    newSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    reactivations: 0,
    activeSubscriptions: 0,
  })
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    if (user && isAdmin) {
      loadMetrics()
    }
  }, [user, isAdmin, dateRange])

  const loadMetrics = async () => {
    setIsLoading(true)
    try {
      const data = await getAdminMetrics(dateRange.startDate, dateRange.endDate)
      setMetrics(data)
    } catch (error) {
      console.error("Error loading admin metrics:", error)
      toast({
        title: "Error",
        description: "Failed to load admin metrics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Monitor SEA Catering's business performance and subscription metrics</p>
        </div>

        {/* Date Range Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
              Date Range Filter
            </CardTitle>
            <CardDescription>Select a date range to view metrics for that period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <Button onClick={loadMetrics} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Update Metrics"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.newSubscriptions}</div>
              <p className="text-xs text-muted-foreground">New customers in selected period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp{metrics.monthlyRecurringRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total MRR from active subscriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reactivations</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.reactivations}</div>
              <p className="text-xs text-muted-foreground">Cancelled subscriptions restarted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">Total active subscriptions</p>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Business Summary</CardTitle>
            <CardDescription>
              Key insights for the selected period ({dateRange.startDate} to {dateRange.endDate})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Growth Metrics</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {metrics.newSubscriptions} new customers acquired</li>
                    <li>• {metrics.reactivations} customers returned</li>
                    <li>• {metrics.activeSubscriptions} total active subscriptions</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Revenue Insights</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Rp{metrics.monthlyRecurringRevenue.toLocaleString()} monthly recurring revenue</li>
                    <li>
                      • Average revenue per user: Rp
                      {metrics.activeSubscriptions > 0
                        ? Math.round(metrics.monthlyRecurringRevenue / metrics.activeSubscriptions).toLocaleString()
                        : 0}
                    </li>
                    <li>• Customer retention improving with {metrics.reactivations} reactivations</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
