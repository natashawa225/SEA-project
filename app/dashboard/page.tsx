"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Calendar, Clock, DollarSign, Package, Play, Pause, X, Loader2 } from "lucide-react"
import { getUserSubscriptions, updateSubscriptionStatus } from "@/lib/supabase-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Subscription {
  id: string
  name: string
  phone: string
  plan_name: string
  plan_price: number
  meal_types: string[]
  delivery_days: string[]
  total_price: number
  status: string
  created_at: string
  allergies?: string
}

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pauseData, setPauseData] = useState({
    startDate: "",
    endDate: "",
  })
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadSubscriptions()
    }
  }, [user])

  const loadSubscriptions = async () => {
    try {
      const data = await getUserSubscriptions(user!.id)
      setSubscriptions(data)
    } catch (error) {
      console.error("Error loading subscriptions:", error)
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePauseSubscription = async (subscriptionId: string) => {
    if (!pauseData.startDate || !pauseData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
      return
    }

    try {
      await updateSubscriptionStatus(subscriptionId, "paused")
      await loadSubscriptions()
      toast({
        title: "Subscription Paused",
        description: `Your subscription has been paused from ${pauseData.startDate} to ${pauseData.endDate}`,
      })
      setPauseData({ startDate: "", endDate: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pause subscription",
        variant: "destructive",
      })
    }
  }

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      await updateSubscriptionStatus(subscriptionId, "active")
      await loadSubscriptions()
      toast({
        title: "Subscription Resumed",
        description: "Your subscription has been resumed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resume subscription",
        variant: "destructive",
      })
    }
  }

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await updateSubscriptionStatus(subscriptionId, "cancelled")
      await loadSubscriptions()
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </h1>
          <p className="text-lg text-gray-600">Manage your meal subscriptions and track your healthy eating journey</p>
        </div>

        {subscriptions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscriptions</h3>
              <p className="text-gray-600 mb-6">
                You don't have any meal subscriptions yet. Start your healthy eating journey today!
              </p>
              <Button asChild>
                <a href="/subscription">Create Subscription</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{subscription.plan_name}</CardTitle>
                      <CardDescription className="text-lg">Subscription for {subscription.name}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Monthly Cost</p>
                        <p className="font-semibold">Rp{subscription.total_price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Meal Types</p>
                        <p className="font-semibold">{subscription.meal_types.length} types</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Delivery Days</p>
                        <p className="font-semibold">{subscription.delivery_days.length} days/week</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Started</p>
                        <p className="font-semibold">{new Date(subscription.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">Meal Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {subscription.meal_types.map((type) => (
                          <Badge key={type} variant="secondary">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Delivery Days</h4>
                      <div className="flex flex-wrap gap-2">
                        {subscription.delivery_days.map((day) => (
                          <Badge key={day} variant="secondary">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {subscription.allergies && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Allergies & Restrictions</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{subscription.allergies}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {subscription.status === "active" && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Subscription
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Pause Subscription</DialogTitle>
                              <DialogDescription>Select the date range for pausing your subscription</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                  id="startDate"
                                  type="date"
                                  value={pauseData.startDate}
                                  onChange={(e) => setPauseData((prev) => ({ ...prev, startDate: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                  id="endDate"
                                  type="date"
                                  value={pauseData.endDate}
                                  onChange={(e) => setPauseData((prev) => ({ ...prev, endDate: e.target.value }))}
                                />
                              </div>
                              <Button onClick={() => handlePauseSubscription(subscription.id)} className="w-full">
                                Confirm Pause
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4 mr-2" />
                              Cancel Subscription
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Subscription</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to cancel this subscription? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-3">
                              <Button
                                variant="destructive"
                                onClick={() => handleCancelSubscription(subscription.id)}
                                className="flex-1"
                              >
                                Yes, Cancel
                              </Button>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                  Keep Subscription
                                </Button>
                              </DialogTrigger>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}

                    {subscription.status === "paused" && (
                      <Button onClick={() => handleResumeSubscription(subscription.id)} size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Resume Subscription
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
