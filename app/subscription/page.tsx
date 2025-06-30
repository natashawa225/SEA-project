"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Calculator, Shield } from "lucide-react"
import { createSubscription } from "@/lib/supabase-client"

const mealPlans = [
  { id: "diet", name: "Diet Plan", price: 30000 },
  { id: "protein", name: "Protein Plan", price: 40000 },
  { id: "royal", name: "Royal Plan", price: 60000 },
]

const mealTypes = [
  { id: "breakfast", name: "Breakfast" },
  { id: "lunch", name: "Lunch" },
  { id: "dinner", name: "Dinner" },
]

const deliveryDays = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
  { id: "saturday", name: "Saturday" },
  { id: "sunday", name: "Sunday" },
]

export default function SubscriptionPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    plan: "",
    mealTypes: [] as string[],
    deliveryDays: [] as string[],
    allergies: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  // Calculate total price
  useEffect(() => {
    if (formData.plan && formData.mealTypes.length > 0 && formData.deliveryDays.length > 0) {
      const selectedPlan = mealPlans.find((plan) => plan.id === formData.plan)
      if (selectedPlan) {
        const price = selectedPlan.price * formData.mealTypes.length * formData.deliveryDays.length * 4.3
        setTotalPrice(Math.round(price))
      }
    } else {
      setTotalPrice(0)
    }
  }, [formData.plan, formData.mealTypes, formData.deliveryDays])

  const handleMealTypeChange = (mealType: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      mealTypes: checked ? [...prev.mealTypes, mealType] : prev.mealTypes.filter((type) => type !== mealType),
    }))
  }

  const handleDeliveryDayChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      deliveryDays: checked ? [...prev.deliveryDays, day] : prev.deliveryDays.filter((d) => d !== day),
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      })
      return false
    }

    // Phone validation
    const phoneRegex = /^08[0-9]{8,11}$/
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid Indonesian phone number (08xxxxxxxxx)",
        variant: "destructive",
      })
      return false
    }

    if (!formData.plan) {
      toast({
        title: "Validation Error",
        description: "Please select a meal plan",
        variant: "destructive",
      })
      return false
    }

    if (formData.mealTypes.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one meal type",
        variant: "destructive",
      })
      return false
    }

    if (formData.deliveryDays.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one delivery day",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a subscription",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const selectedPlan = mealPlans.find((plan) => plan.id === formData.plan)

      const subscriptionData = {
        user_id: user.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        plan_id: formData.plan,
        plan_name: selectedPlan?.name || "",
        plan_price: selectedPlan?.price || 0,
        meal_types: formData.mealTypes,
        delivery_days: formData.deliveryDays,
        allergies: formData.allergies.trim(),
        total_price: totalPrice,
        status: "active",
      }

      await createSubscription(subscriptionData)

      toast({
        title: "Subscription Created!",
        description: "Your meal subscription has been successfully created. You will receive a confirmation shortly.",
      })

      // Reset form
      setFormData({
        name: "",
        phone: "",
        plan: "",
        mealTypes: [],
        deliveryDays: [],
        allergies: "",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Subscription error:", error)
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Start Your Subscription</h1>
          <p className="text-xl text-gray-600">Customize your healthy meal plan and get started today</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subscription Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                  Subscription Details
                </CardTitle>
                <CardDescription>Fill in your details to create your personalized meal subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>

                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Active Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="08123456789"
                        required
                      />
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Plan Selection *</h3>
                    <RadioGroup
                      value={formData.plan}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, plan: value }))}
                    >
                      {mealPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <RadioGroupItem value={plan.id} id={plan.id} />
                          <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{plan.name}</span>
                              <span className="text-emerald-600 font-bold">Rp{plan.price.toLocaleString()}/meal</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Meal Types */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Meal Types * (Select at least one)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {mealTypes.map((mealType) => (
                        <div
                          key={mealType.id}
                          className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            id={mealType.id}
                            checked={formData.mealTypes.includes(mealType.id)}
                            onCheckedChange={(checked) => handleMealTypeChange(mealType.id, checked as boolean)}
                          />
                          <Label htmlFor={mealType.id} className="cursor-pointer">
                            {mealType.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Days */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Delivery Days * (Select at least one)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {deliveryDays.map((day) => (
                        <div
                          key={day.id}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            id={day.id}
                            checked={formData.deliveryDays.includes(day.id)}
                            onCheckedChange={(checked) => handleDeliveryDayChange(day.id, checked as boolean)}
                          />
                          <Label htmlFor={day.id} className="cursor-pointer text-sm">
                            {day.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Allergies & Dietary Restrictions</h3>
                    <Textarea
                      value={formData.allergies}
                      onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
                      placeholder="Please list any allergies or dietary restrictions..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading || totalPrice === 0}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Subscription...
                      </>
                    ) : (
                      `Subscribe Now - Rp${totalPrice.toLocaleString()}/month`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Total Price = Plan Price × Meal Types × Delivery Days × 4.3 */}
          {/* Price Calculator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-emerald-600" />
                  Price Calculator
                </CardTitle>
                <CardDescription>Your monthly subscription cost</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.plan && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Selected Plan:</span>
                      <span className="font-medium">{mealPlans.find((p) => p.id === formData.plan)?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price per meal:</span>
                      <span className="font-medium">
                        Rp{mealPlans.find((p) => p.id === formData.plan)?.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {formData.mealTypes.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Meal types:</span>
                    <span className="font-medium">{formData.mealTypes.length}</span>
                  </div>
                )}

                {formData.deliveryDays.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery days:</span>
                    <span className="font-medium">{formData.deliveryDays.length}</span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Calculation:</span>
                    <span>
                      {formData.plan && formData.mealTypes.length > 0 && formData.deliveryDays.length > 0
                        ? `${mealPlans.find((p) => p.id === formData.plan)?.price.toLocaleString()} × ${formData.mealTypes.length} × ${formData.deliveryDays.length} × 4.3`
                        : "Select options above"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-emerald-600">
                    <span>Total per month:</span>
                    <span>Rp{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                  * Price is calculated based on: Plan Price × Meal Types × Delivery Days × 4.3 weeks per month
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
